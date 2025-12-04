import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  Pressable,
  Image,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
// --- CORRECTED IMPORT PATHS ---
import API_URL from '../../apiConfig';
import { Colors } from '../../constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useCartStore, MenuItem } from '../../store/cartStore'; 
// ------------------------------
// Import animation components
import Animated, { FadeInDown, FadeInUp, ZoomIn, Layout } from 'react-native-reanimated';

// --- We'll hardcode the names of our "favorites" ---
const QUICK_ADD_NAMES = ['Espresso', 'Latte', 'Croissant'];

export default function HomeScreen() {
  const router = useRouter();
  
  // State for the "Surprise" item
  const [randomItem, setRandomItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- NEW STATE FOR QUICK ADD ---
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [isLoadingFavs, setIsLoadingFavs] = useState(true);
  const [addedItems, setAddedItems] = useState<string[]>([]); // To track clicks
  
  const addItem = useCartStore((state) => state.addItem);

  // --- NEW: Fetch "Favorites" on screen load ---
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoadingFavs(true);
        const response = await fetch(`${API_URL}/menu`);
        if (!response.ok) {
          throw new Error("Could not fetch menu for favorites.");
        }
        const fullMenu: MenuItem[] = await response.json();
        
        // Filter the full menu to find only our 3 favorites
        const favs = fullMenu.filter(item => QUICK_ADD_NAMES.includes(item.name));
        setFavorites(favs);
        
      } catch (error: any) {
        console.error("Failed to fetch favorites:", error.message);
      } finally {
        setIsLoadingFavs(false);
      }
    };
    fetchFavorites();
  }, []);

  // --- Navigation Functions ---
  const showFullMenu = () => {
    router.push('/menu');
  };

  const fetchSurpriseItem = async () => {
    setIsLoading(true);
    setRandomItem(null); 
    try {
      const response = await fetch(`${API_URL}/menu/random`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Network response was not ok');
      }
      const item: MenuItem = await response.json();
      setRandomItem(item);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Could not fetch a surprise item.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- NEW: Handle Quick Add ---
  const handleQuickAdd = (item: MenuItem) => {
    addItem(item);
    setAddedItems(prev => [...prev, item._id]); // Show "check"
    // Reset checkmark after 1.5 seconds
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== item._id));
    }, 1500);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        
        {/* === "SKYBREWS" BRAND HEADER (ANIMATED) === */}
        <Animated.View 
          style={styles.headerContainer}
          entering={FadeInDown.duration(600).delay(200)}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>
          <View style={styles.brandRow}>
            <FontAwesome 
              name="coffee"
              size={36}
              color={Colors.text} // Black icon
              style={styles.headerIcon} 
            />
            <Text style={styles.brandName}>Skybrews</Text>
          </View>
          {/* --- 1. ADDED SLOGAN --- */}
          <Text style={styles.tagline}>Elevate Your Day</Text>
        </Animated.View>
        
        {/* === BUTTONS (ANIMATED) === */}
        <Animated.View 
          style={styles.buttonContainer}
          entering={FadeInUp.duration(500).delay(400)}
        >
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonPrimary,
              pressed && styles.buttonPressed,
            ]}
            onPress={showFullMenu}
          >
            <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
              View Full Menu
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonSecondary,
              pressed && styles.buttonPressed,
            ]}
            onPress={fetchSurpriseItem} 
            disabled={isLoading}
          >
            <FontAwesome 
              name="magic" 
              size={16} 
              color={Colors.primary} 
              style={{ marginRight: 10 }} 
            />
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Surprise Me!
            </Text>
          </Pressable>
        </Animated.View>
        

        {/* --- 1. "SURPRISE ITEM" CARD (MOVED UP) --- */}
        {isLoading && (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        )}
        
        {randomItem && !isLoading && (
          <Animated.View style={styles.card} entering={ZoomIn.duration(500).delay(200)}>
            <Text style={styles.dealTitle}>Your Surprise Item!</Text>
            <Image source={{ uri: randomItem.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{randomItem.name}</Text>
              <Text style={styles.cardPrice}>Rs. {randomItem.price.toFixed(2)}</Text>
              
              <Pressable 
                style={[
                  styles.button, 
                  styles.buttonPrimary 
                ]}
                onPress={() => router.push(`/item/${randomItem._id}`)} 
              >
                <FontAwesome 
                  name="info-circle" 
                  size={16} 
                  color="white" 
                  style={{ marginRight: 10 }} 
                />
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
                  View Details
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {/* --- 2. "QUICK ADD" SECTION (MOVED DOWN) --- */}
        <Animated.View 
          style={styles.quickAddContainer}
          entering={FadeInUp.duration(500).delay(600)}
        >
          <Text style={styles.quickAddTitle}>Quick Favorites</Text>
          {isLoadingFavs ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <View style={styles.favoritesList}>
              {favorites.map((item) => {
                const isAdded = addedItems.includes(item._id);
                return (
                  <Animated.View key={item._id} style={styles.favCard} layout={Layout.duration(300)}>
                    <Image source={{ uri: item.image }} style={styles.favImage} />
                    <View style={styles.favDetails}>
                      <Text style={styles.favName}>{item.name}</Text>
                      <Text style={styles.favPrice}>Rs. {item.price.toFixed(2)}</Text>
                    </View>
                    <Pressable 
                      style={[styles.favButton, isAdded && styles.favButtonAdded]}
                      onPress={() => handleQuickAdd(item)}
                      disabled={isAdded}
                    >
                      <FontAwesome name={isAdded ? "check" : "plus"} size={16} color={isAdded ? 'white' : Colors.primary} />
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </Animated.View>
        
      </View>
    </ScrollView>
  );
}

// === 4. UPDATED STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card, // White background
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 100, // Space for header
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    marginRight: 15,
  },
  brandName: {
    fontSize: 44,
    fontWeight: 'bold',
    color: Colors.text, // Black
  },
  tagline: { // Slogan style
    fontSize: 18,
    fontWeight: '300',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  buttonContainer: {
    width: '90%',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: Colors.primary,
  },
  loader: {
    marginVertical: 30,
  },
  // --- New Quick Add Styles ---
  quickAddContainer: {
    width: '100%',
    marginTop: 40,
  },
  quickAddTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  favoritesList: {
    width: '100%',
  },
  favCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  favImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  favDetails: {
    flex: 1,
    marginLeft: 12,
  },
  favName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  favPrice: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  favButton: {
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  favButtonAdded: {
    backgroundColor: '#28a745', // Success Green
  },
  // --- Surprise Card Styles ---
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    marginTop: 40,
    marginBottom: 40, // Add space at the bottom
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden', 
  },
  dealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    padding: 20,
    paddingBottom: 0,
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
    marginTop: 10,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text, // Black price
    marginBottom: 20,
  },
});