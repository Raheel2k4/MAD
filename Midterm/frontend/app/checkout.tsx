import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  Alert, 
  ScrollView // 1. Import ScrollView
} from 'react-native';
import { Colors } from '../constants/colors'; // Corrected path
import { useCartStore } from '../store/cartStore'; // Corrected path
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const router = useRouter();
  
  // Get items and total from the store
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // State for our form inputs
  const [name, setName] = useState('');
  const [address, setAddress] = useState(''); // Changed from table
  const [phone, setPhone] = useState('');
  // Removed email state

  const handleConfirmOrder = () => {
    // Simple form validation
    if (!name || !address || !phone) { // Removed email
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // In a real app, you'd also validate the email/phone format
    
    console.log("Order Confirmed:", { name, address, phone, items, totalPrice }); // Changed table to address
    
    clearCart();
    
    router.replace('/orderSuccess');
  };

  // 2. Updated layout structure
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={16} color={Colors.primary} />
          <Text style={styles.backButtonText}>Back to Cart</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Content is now scrollable */}
      <ScrollView>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summaryItems}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.totalPrice}>Rs. {totalPrice.toFixed(2)}</Text>
        </View>
        
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Your Details</Text>
          
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          {/* --- FIELD CHANGED --- */}
          <Text style={styles.inputLabel}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., '123 Main St' or 'Takeaway'"
            placeholderTextColor={Colors.textSecondary}
            value={address}
            onChangeText={setAddress}
          />
          {/* ------------------- */}

          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="For order updates"
            placeholderTextColor={Colors.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          
          {/* --- REMOVED EMAIL FIELD --- */}
        </View>
      </ScrollView>

      {/* Button is now in a separate footer view */}
      <View style={styles.footer}>
        <Pressable style={styles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={styles.confirmButtonText}>
            Confirm & Pay (Rs. {totalPrice.toFixed(2)})
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// 3. Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    margin: 15,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  summaryItems: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20, // Add space at the bottom of the scroll
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  // New footer style
  footer: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 15,
    paddingBottom: 45, // MOVED UP. Was 30, now 30 + 15 = 45
  },
  // Updated button style
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    // Removed margin and marginTop: 'auto'
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

