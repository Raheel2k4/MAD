import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SkillOfferCard = ({ item, navigation }) => { // <--- Receives navigation
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpand = useCallback(() => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, animation]);

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });
  
  // Function to navigate to the Direct Message screen
  const handleConnect = () => {
    // Navigates to DirectMessageScreen, passing the user name for the chat header
    navigation.navigate('DirectMessageScreen', { userName: item.userName });
  };


  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <Image
            style={styles.avatar}
            source={{ uri: `https://placeholder-image-service.onrender.com/image/40x40?prompt=Profile%20picture%20of%20${item.userName}&id=user-${item.id}` }}
            alt={`Profile picture of ${item.userName}`}
          />
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.postTime}>{item.postTime}</Text>
          </View>
        </View>
        <View style={styles.skillTag}>
          <Text style={styles.skillTagText}>{item.category}</Text>
        </View>
      </View>

      <Text style={styles.title}>{item.title}</Text>

      <Animated.View style={[styles.descriptionContainer, { height: heightInterpolate }]}>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleExpand}>
        <Text style={styles.toggleButtonText}>
          {expanded ? 'Hide Details' : 'View Details'}
        </Text>
      </TouchableOpacity>
      
      {/* Connect Button that initiates the DM */}
      <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Sample data for demonstration
  const [skillOffers] = useState([
    {
      id: '1',
      userName: 'Alex Johnson',
      postTime: '2 hours ago',
      category: 'Programming',
      title: 'Python Tutoring for Beginners',
      description: 'I offer Python tutoring sessions for complete beginners. We\'ll cover basic syntax, data structures, and simple projects. Available weekends and evenings.',
    },
    {
      id: '2',
      userName: 'Maria Garcia',
      postTime: '1 day ago',
      category: 'Music',
      title: 'Guitar Lessons - All Levels',
      description: 'Professional guitarist with 10+ years experience offering lessons for all skill levels. Learn chords, scales, and your favorite songs. Flexible scheduling.',
    },
    {
      id: '3',
      userName: 'David Kim',
      postTime: '3 days ago',
      category: 'Art',
      title: 'Drawing Basics Workshop',
      description: 'Learn the fundamentals of drawing including perspective, shading, and composition. No prior experience needed. Materials provided for first session.',
    },
    {
      id: '4',
      userName: 'Sarah Chen',
      postTime: '4 days ago',
      category: 'Fitness',
      title: 'Yoga & Mindfulness Sessions',
      description: 'Certified yoga instructor offering personalized sessions focused on flexibility, strength, and mindfulness. Suitable for all levels including complete beginners.',
    },
    {
      id: '5',
      userName: 'James Wilson',
      postTime: '5 days ago',
      category: 'Language',
      title: 'Spanish Conversation Practice',
      description: 'Native Spanish speaker offering conversation practice sessions. We can focus on specific topics or general conversation to improve fluency and confidence.',
    },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SkillSwap</Text>
        <View style={styles.headerButtons}>
          
          {/* 1. Create Post Button (Leftmost in group) */}
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('CreatePost')}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>

          {/* 2. Message Button (Middle) - Navigates to all conversations list */}
          <TouchableOpacity
            style={styles.messagesButton}
            onPress={() => {
              navigation.navigate('ConversationScreen');
            }}
          >
            <Ionicons name="chatbox-ellipses-outline" size={24} color="#3b82f6" />
          </TouchableOpacity>

          {/* 3. Profile Button (Rightmost in group) */}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              style={styles.profileIcon}
              source={{ uri: 'https://placeholder-image-service.onrender.com/image/24x24?prompt=User%20profile%20icon&id=profile-icon' }}
              alt="User profile icon"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Available Skills</Text>

        <FlatList
          data={skillOffers}
          renderItem={({ item }) => <SkillOfferCard item={item} navigation={navigation} />} // <--- Passing navigation
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    lineHeight: 24,
  },
  messagesButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1e293b',
  },
  postTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  skillTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  descriptionContainer: {
    overflow: 'hidden',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 22,
  },
  toggleButton: {
    marginTop: 12,
  },
  toggleButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
  },
  // Styles for Connect Button
  connectButton: {
    backgroundColor: '#10b981', 
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-end',
    marginTop: 10,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
});

export default HomeScreen;
