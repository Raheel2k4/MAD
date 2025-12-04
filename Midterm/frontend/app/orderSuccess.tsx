import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated'; // 1. Import Reanimated

export default function OrderSuccessModal() {
  const router = useRouter();

  const goHome = () => {
    router.replace('/'); 
  };

  return (
    // 2. Animate the backdrop
    <Animated.View style={styles.backdrop} entering={FadeIn.duration(200)}>
      {/* 3. Animate the card with a "ZoomIn" spring */}
      <Animated.View style={styles.modalCard} entering={ZoomIn.duration(400)}>
        <FontAwesome name="check-circle" color="#28a745" size={60} />
        <Text style={styles.title}>Order Confirmed!</Text>
        
        <Text style={styles.subText}>
          Your order has been placed. It will be ready for pickup shortly.
        </Text>

        <Pressable style={styles.closeButton} onPress={goHome}>
          <Text style={styles.closeButtonText}>Back to Home</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// 4. STYLES (Light Theme)
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', 
  },
  modalCard: {
    width: '85%',
    backgroundColor: Colors.card, // White card
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text, // Black
    marginTop: 20,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: Colors.textSecondary, // Dark grey
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});