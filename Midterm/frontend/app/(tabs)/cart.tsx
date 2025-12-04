import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { useCartStore, CartItem } from '../../store/cartStore'; 
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

// This is a component for a single row in the cart
const CartRow = ({ item }: { item: CartItem }) => {
  // Get the functions from our store
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Rs. {item.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <Pressable onPress={() => removeItem(item._id)} style={styles.controlButton}>
          <FontAwesome name="minus" size={14} color={Colors.primary} />
        </Pressable>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <Pressable onPress={() => addItem(item)} style={styles.controlButton}>
          <FontAwesome name="plus" size={14} color={Colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};


export default function CartScreen() {
  // Get all items and the clear function from the store
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  // Calculate the total price
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const router = useRouter(); // Get the router

  // Show a message if the cart is empty
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="shopping-cart" size={60} color={Colors.border} />
        <Text style={styles.emptyText}>Your Cart is Empty</Text>
        <Text style={styles.emptySubText}>Looks like you haven't added anything to your cart yet.</Text>
        <Link href="/menu" asChild>
          <Pressable style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  // If we have items, show the list
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => <CartRow item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
      />

      {/* --- Order Summary --- */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Total Price:</Text>
          <Text style={styles.totalPrice}>Rs. {totalPrice.toFixed(2)}</Text>
        </View>
        
        {/* This button navigates to the checkout screen */}
        <Pressable 
          style={styles.checkoutButton} 
          onPress={() => router.push('/checkout')}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </Pressable>

        <Pressable onPress={clearCart}>
          <Text style={styles.clearText}>Clear Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.text,
  },
  // Cart Item Row
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginVertical: 4,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 20,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginHorizontal: 16,
  },
  // Summary Footer
  summaryContainer: {
    backgroundColor: Colors.card,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearText: {
    color: Colors.danger,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 30,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

