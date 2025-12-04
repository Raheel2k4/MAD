import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  Image, // 1. Import Image
} from 'react-native';
import { useRouter } from 'expo-router';
// --- CORRECTED IMPORT PATHS ---
import API_URL from '../apiConfig';
import { Colors } from '../constants/colors';
import { useCartStore, MenuItem, CartItem } from '../store/cartStore'; 
import { FontAwesome } from '@expo/vector-icons'; 
import Animated, { FadeInUp } from 'react-native-reanimated';
// ------------------------------

export default function MenuScreen() {
  const router = useRouter();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FIX for implicit 'any' types ---
  const items = useCartStore((state: { items: CartItem[] }) => state.items);
  const totalItems = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
  // ------------------------------------

  // --- THIS IS THE CORRECTED CODE ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/menu`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: MenuItem[] = await response.json();
        setMenu(data);
      } catch (error) {
        Alert.alert("Error", "Could not fetch the menu.");
      } finally {
        setLoading(false); // This will now be called
      }
    };
    fetchMenu();
  }, []); // Empty array means this runs once on mount
  // ---------------------------------

  const renderItem = ({ item, index }: { item: MenuItem, index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 50).duration(300)}>
      <Pressable onPress={() => router.push(`/item/${item._id}`)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <View style={styles.itemPriceInfo}>
            {/* 2. Add the Image component here */}
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <Text style={styles.priceText}>Rs. {item.price.toFixed(2)}</Text>
            {!item.inStock && (
              <Text style={styles.outOfStock}>Out of Stock</Text>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Full Menu</Text>
        <Pressable 
          onPress={() => router.push('/(tabs)/cart')} 
          style={styles.cartIconContainer}
        >
          <FontAwesome name="shopping-cart" size={24} color={Colors.text} />
          {totalItems > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <FlatList
        data={menu}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ 
          paddingHorizontal: 10,
          paddingBottom: 20,
        }} 
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

// === LIGHT THEME + NEW STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Light grey BG
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20, 
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.text, // Black
  },
  cartIconContainer: {
    padding: 8,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.card, // White card
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    paddingRight: 10, // Ensure space for price
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary, // Sky Blue
  },
  itemCategory: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  // 3. Add the new style for the small image
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.border,
    marginBottom: 8,
  },
  itemPriceInfo: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text, // Black
  },
  outOfStock: {
    fontSize: 12,
    color: Colors.danger,
    fontStyle: 'italic',
    marginTop: 4,
  },
});