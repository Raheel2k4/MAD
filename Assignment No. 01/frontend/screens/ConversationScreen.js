import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for the list of conversations
const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Alex Johnson',
    lastMessage: 'Photography editing sounds perfect! I need a few headshots.',
    time: '2h ago',
    unreadCount: 1,
  },
  {
    id: 'c2',
    name: 'Maria Garcia',
    lastMessage: 'Great, let\'s meet next Tuesday for the guitar lesson.',
    time: '5h ago',
    unreadCount: 0,
  },
  {
    id: 'c3',
    name: 'David Kim',
    lastMessage: 'I found a good resource for shading techniques, check it out!',
    time: '1d ago',
    unreadCount: 0,
  },
  {
    id: 'c4',
    name: 'Sarah Chen',
    lastMessage: 'Thanks for the mindfulness tips, they really helped!',
    time: '2d ago',
    unreadCount: 0,
  },
];

const ConversationCard = ({ conversation, onPress }) => (
  // Added TouchableOpacity to make the card clickable
  <TouchableOpacity style={styles.card} onPress={() => onPress(conversation.name)}>
    <Image
      style={styles.avatar}
      source={{ uri: `https://placeholder-image-service.onrender.com/image/50x50?prompt=Profile%20picture%20of%20${conversation.name}&id=chat-user-${conversation.id}` }}
      alt={`Profile picture of ${conversation.name}`}
    />
    <View style={styles.textContainer}>
      <View style={styles.nameAndTime}>
        <Text style={styles.name}>{conversation.name}</Text>
        <Text style={styles.time}>{conversation.time}</Text>
      </View>
      <View style={styles.lastMessageContainer}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const ConversationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    navigation.goBack();
  };

  // New function to handle tapping a conversation card
  const handleOpenConversation = (userName) => {
    // Navigate to DirectMessageScreen, passing the user name and setting isExistingChat to true
    navigation.navigate('DirectMessage', { 
      userName: userName,
      isExistingChat: true, // This flag ensures dummy messages are loaded
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header - Styled like others with explicit padding */}
      <View style={[styles.header, { paddingTop: insets.top + 16, paddingBottom: 16 }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        {/* Invisible spacer for centering the title */}
        <View style={styles.spacer} /> 
      </View>

      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ConversationCard 
            conversation={item} 
            onPress={handleOpenConversation} 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  // --- Header Styles ---
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  // --- List & Card Styles ---
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  textContainer: {
    flex: 1,
  },
  nameAndTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#1e293b',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  lastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    flex: 1,
    marginRight: 10,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});

export default ConversationScreen;
