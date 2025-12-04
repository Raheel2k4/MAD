import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Correct module import
import { Ionicons } from '@expo/vector-icons';

// Dummy messages for demonstration (used only for simulating existing chats)
const DUMMY_MESSAGES = [
  { id: 'm1', text: 'Hi! I saw your post about Python tutoring. I\'m definitely interested!', sender: 'user' },
  { id: 'm2', text: 'That\'s great! What specific Python topics are you looking to cover first?', sender: 'other' },
  { id: 'm3', text: 'Mostly beginner syntax and data structures. I can offer some help with photography editing in return!', sender: 'user' },
  { id: 'm4', text: 'Photography editing sounds perfect! I need a few headshots. When works for you to meet?', sender: 'other' },
];

const DirectMessageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  // 1. EXTRACTING PARAMETER: Get the recipient's name and the flag indicating an existing conversation
  const { userName = 'SkillSwap User', isExistingChat } = route.params || {};

  const [inputMessage, setInputMessage] = useState('');
  
  // 2. CONDITIONAL INITIALIZATION: Check the flag to decide the starting messages
  const initialMessages = isExistingChat ? [...DUMMY_MESSAGES].reverse() : [];
  const [messages, setMessages] = useState(initialMessages); 

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputMessage.trim(),
        sender: 'user', 
      };
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      setInputMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.currentUserBubble : styles.otherUserBubble
    ]}>
      <Text style={item.sender === 'user' ? styles.currentUserText : styles.otherUserText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header - Applies top safe area inset and fixed vertical padding for consistent look */}
      <View style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 16 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{userName}</Text>
        {/* Invisible spacer to center the title */}
        <View style={styles.spacer} /> 
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted 
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area - Applies bottom safe area inset to clear the home indicator */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 10 }]}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder={`Message ${userName}...`}
          placeholderTextColor="#94a3b8"
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage} disabled={!inputMessage.trim()}>
          <Ionicons name="send" size={24} color={inputMessage.trim() ? "#fff" : "#cbd5e1"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
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
  spacer: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  messageList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  currentUserBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6', 
    borderBottomRightRadius: 4,
    marginRight: 0,
  },
  otherUserBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0', 
    borderBottomLeftRadius: 4,
    marginLeft: 0,
  },
  currentUserText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  otherUserText: {
    color: '#1e293b',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginRight: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DirectMessageScreen;
