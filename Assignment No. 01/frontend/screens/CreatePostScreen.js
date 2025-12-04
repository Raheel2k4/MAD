import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Added Ionicons import

const CreatePostScreen = () => { // Renamed component to CreatePostScreen
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skill, setSkill] = useState('');

  // Function to handle post submission
  const handleSubmitPost = () => {
    if (!title.trim() || !description.trim() || !skill.trim()) {
      Alert.alert('Missing Fields', 'Please fill out all fields before submitting.');
      return;
    }
    // Simulate successful post creation
    Alert.alert(
      'Post Created', // Updated text
      `Your post for "${title}" has been created!`, // Updated text
      [{
        text: 'OK',
        onPress: () => navigation.goBack() // Navigate back after success
      }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Custom Header with Stylish Back Button (copied from ProfileScreen) */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {/* Replaced text chevron with Ionicons chevron-back */}
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Post</Text> {/* Updated header title */}
        {/* Placeholder to balance the header layout against the back button */}
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.formLabel}>Post Title</Text> {/* Updated label */}
        <TextInput
          style={styles.textInput}
          placeholder="e.g., Guitar Lessons for Beginners"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.formLabel}>Post Category (e.g., Request, Offer)</Text> {/* Updated label */}
        <TextInput
          style={styles.textInput}
          placeholder="Specify the category or skill" // Updated placeholder
          placeholderTextColor="#94a3b8"
          value={skill}
          onChangeText={setSkill}
        />

        <Text style={styles.formLabel}>Detailed Description</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="Describe what you are posting and the expected time commitment." // Updated placeholder
          placeholderTextColor="#94a3b8"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitPost}> {/* Updated function call */}
          <Text style={styles.submitButtonText}>Submit Post</Text> {/* Updated button text */}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff', // Header background remains white
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  // Style for the circular blue button (FAB style)
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes it a perfect circle
    backgroundColor: '#3b82f6', // Blue color
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, // Adds a lift effect
    shadowRadius: 4,
    elevation: 5,
  },
  // Removed backTextIcon as we are now using Ionicons
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  rightPlaceholder: {
    // Placeholder to balance the layout since there is no button on the right
    width: 40, 
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 32,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
});

export default CreatePostScreen;
