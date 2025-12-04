import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  StyleSheet, // Added StyleSheet for cleaner code
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // <-- ADDED: Import Ionicons

const EditProfileScreen = ({ userData, setUserData }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Ensure initial state handling for userData fields is safe
  const [userName, setUserName] = useState(userData?.name || '');
  const [userBio, setUserBio] = useState(userData?.bio || '');
  const [userSkills, setUserSkills] = useState(userData?.skills?.join(', ') || '');
  
  const [successMessage, setSuccessMessage] = useState(null);
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (successMessage) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => setSuccessMessage(null));
    }
  }, [successMessage, opacity]);
  
  const handleSaveChanges = () => {
    // Update the state in the parent component
    setUserData(prevData => ({
      ...prevData,
      name: userName,
      bio: userBio,
      skills: userSkills.split(',').map(skill => skill.trim()).filter(s => s.length > 0),
    }));
    setSuccessMessage('Profile updated successfully!');
  };

  const handleChangeProfilePicture = () => {
    Alert.alert(
      'Feature Coming Soon',
      'Change profile picture functionality is a work in progress.'
    );
  };

  return (
    // Replaced SafeAreaView with a View that uses dynamic padding
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            {/* START: Updated Back Button for consistency */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            {/* END: Updated Back Button */}
            
            <Text style={styles.headerTitle}>Edit Profile</Text>
            
            {/* Spacer matching the back button width to center the title */}
            <View style={{ width: 40, height: 40 }} /> 
          </View>

          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{ uri: 'https://placeholder-image-service.onrender.com/image/120x120?prompt=Default%20user%20avatar%20icon&id=default-avatar' }}
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              alt="Default user avatar icon"
            />
            <TouchableOpacity onPress={handleChangeProfilePicture}>
              <Text style={styles.changePhotoText}>Change Profile Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                value={userBio}
                onChangeText={setUserBio}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Skills (comma-separated)</Text>
              <TextInput
                style={styles.input}
                value={userSkills}
                onChangeText={setUserSkills}
                placeholder="e.g., React, Python, UI/UX Design"
              />
            </View>
          </View>

          {/* Footer inside the ScrollView for proper keyboard avoidance */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
          
          {/* Animated success message */}
          {successMessage && (
            <Animated.View style={[styles.successMessageContainer, { opacity }]}>
              <Text style={styles.successMessageText}>{successMessage}</Text>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
    marginHorizontal: -20, // Negative margin to fill the width
    paddingHorizontal: 20,
  },
  // UPDATED: Back button style to be a blue circular icon
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  // REMOVED: backIcon style is no longer needed
  headerTitle: {
    fontSize: 20,
    // Assuming 'Inter-Bold' is available
    color: '#1e293b',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: '#cbd5e1', // Placeholder background
  },
  changePhotoText: {
    color: '#3b82f6',
    fontSize: 14,
    // Assuming 'Inter-Medium' is available
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    // Assuming 'Inter-Medium' is available
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    // Assuming 'Inter-Regular' is available
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    // Assuming 'Inter-Regular' is available
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: 20,
    paddingVertical: 20,
    alignSelf: 'stretch',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    // Assuming 'Inter-Bold' is available
  },
  successMessageContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  successMessageText: {
    color: '#fff',
    fontSize: 16,
    // Assuming 'Inter-Regular' is available
  },
});

export default EditProfileScreen;
  