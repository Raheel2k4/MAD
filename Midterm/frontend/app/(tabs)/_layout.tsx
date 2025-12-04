import { Tabs } from 'expo-router';
// Note: Corrected paths to go up one more level
import { Colors } from '../../constants/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore'; // <-- 1. IMPORT THE BRAIN

// Helper component for the tab icons
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={26} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // <-- 2. GET THE ITEMS FROM THE BRAIN
  const items = useCartStore((state) => state.items);
  // Calculate the total *quantity* of items, not just the number of rows
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint, // Sky Blue
        tabBarInactiveTintColor: Colors.tabIconDefault,
        
        // This is your "footer" style
        tabBarStyle: {
          backgroundColor: Colors.card, // White
          borderTopColor: Colors.border, // Subtle border
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home', // Correct "Home" title
          headerShown: false, // Header is hidden
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      {/* --- 3. ADD THE NEW CART TAB SCREEN --- */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'My Cart',
          headerShown: false, // We use a custom header in the file
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />,
          // This adds the red badge!
          tabBarBadge: totalItems > 0 ? totalItems : undefined, 
        }}
      />
      
    </Tabs>
  );
}

