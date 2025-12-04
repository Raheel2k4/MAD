import { Stack } from 'expo-router';
import { Colors } from '../constants/colors';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.text,
          headerShadowVisible: false, 
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        <Stack.Screen
          name="menu"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />
        
        <Stack.Screen 
          name="item/[id]" 
          options={{ 
            headerShown: false, 
            presentation: 'fullScreenModal',
          }} 
        />
        
        {/* --- ADD THESE TWO NEW SCREENS --- */}
        <Stack.Screen
          name="checkout"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="orderSuccess"
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }}
        />

      </Stack>
    </>
  );
}

