// app.js  ←←← MUST be named exactly "app.js" (lowercase)
import 'react-native-url-polyfill/auto';

import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginPage';
import HomeScreen from './screens/HomeFeed';
import ProfileScreen from './screens/ProfileScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ConversationScreen from './screens/ConversationScreen';
import DirectMessageScreen from './screens/DirectMessageScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userData, setUserData] = useState({
    name: 'Muhammad Raheel Nawaz',
    bio: 'Passionate developer and musician with interest in various creative and technical skills. Love to learn and share knowledge with others.',
    skills: ['React Native', 'Guitar', 'Photography', 'Python', 'UI/UX Design', 'Cooking'],
    joinedDate: 'January 2024',
  });

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ConversationScreen" component={ConversationScreen} />
            <Stack.Screen name="DirectMessageScreen" component={DirectMessageScreen} />
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} userData={userData} />}
            </Stack.Screen>
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="EditProfile">
              {(props) => <EditProfileScreen {...props} userData={userData} setUserData={setUserData} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}