import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Pressable, 
  Alert, 
  Image
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
// --- CORRECTED IMPORT PATHS ---
import { Colors } from '../../constants/colors';
import API_URL from '../../apiConfig';
import { FontAwesome } from '@expo/vector-icons';
import { useCartStore, MenuItem } from '../../store/cartStore';
// ------------------------------

export default function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${API_URL}/menu/${id}`);
        if (!response.ok) {
          throw new Error('Item not found');
        }
        const data = await response.json();
        setItem(data);
      } catch (error: any) {
        Alert.alert("Error", error.message || "Could not fetch item.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (item && !isAdded) {
      addItem(item);
      setIsAdded(true);
      setTimeout(() => {
        router.back();
      }, 1000); 
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!item) {
     return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="chevron-left" size={16} color={Colors.primary} />
        <Text style={styles.backButtonText}>Back to Menu</Text>
      </Pressable>
      
      <Image 
        source={{ uri: item.image }} 
        style={styles.image} // Style is now fixed
        onError={() => console.log("Error loading image")}
      />

      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Rs. {item.price.toFixed(2)}</Text>
      
      {/* --- THIS IS NOW DYNAMIC --- */}
      <Text style={styles.description}>
        {item.description}
      </Text>
      {/* --------------------------- */}
      
      {!item.inStock && (
        <Text style={styles.outOfStock}>Currently Out of Stock</Text>
      )}

      {/* ... (Button logic is identical) ... */}
      <Pressable 
        style={[
          styles.cartButton, 
          isAdded ? styles.cartButtonAdded : 
          item.inStock ? styles.cartButtonActive : styles.cartButtonDisabled
        ]}
        onPress={handleAddToCart}
        disabled={!item.inStock || isAdded} 
      >
        {isAdded ? (
          <>
            <FontAwesome name="check" size={16} color="white" />
            <Text style={[styles.cartButtonText, styles.cartButtonTextActive]}>
              Added!
            </Text>
          </>
        ) : item.inStock ? (
          <Text style={[styles.cartButtonText, styles.cartButtonTextActive]}>
            Add to Cart
          </Text>
        ) : (
          <Text style={[styles.cartButtonText, styles.cartButtonTextDisabled]}>
            Out of Stock
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 60,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: Colors.border, // <-- THIS IS THE FIX (was Colors.card)
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  outOfStock: {
    fontSize: 16,
    color: Colors.danger,
    fontWeight: '600',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  cartButton: {
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cartButtonActive: {
    backgroundColor: Colors.primary,
  },
  cartButtonDisabled: {
    backgroundColor: Colors.border,
  },
  cartButtonAdded: {
    backgroundColor: '#28a745',
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cartButtonTextActive: {
    color: 'white',
  },
  cartButtonTextDisabled: {
    color: Colors.textSecondary,
    marginLeft: 0,
  },
});