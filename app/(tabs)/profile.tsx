import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Settings, Grid, Heart, MessageCircle, Share } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const POST_SIZE = (SCREEN_WIDTH - 48) / 3; // 3 columns with padding

const mockUserPosts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  image: `https://images.pexels.com/photos/${3000 + i}/pexels-photo-${3000 + i}.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop`,
  likes: Math.floor(Math.random() * 100) + 10,
  comments: Math.floor(Math.random() * 50) + 5,
}));

export default function ProfileScreen() {
  const user = {
    name: 'Maria Silva',
    username: 'maria_bordados',
    bio: 'Apaixonada por bordados e artesanato 🧵\nCompartilhando técnicas e inspirações\n📍 São Paulo, Brasil',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    followers: 1234,
    following: 567,
    posts: 89,
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.username}>@{user.username}</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(user.followers)}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          <Text style={styles.displayName}>{user.name}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Share size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.activeTab}>
            <Grid size={24} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        <View style={styles.postsGrid}>
          {mockUserPosts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.postItem}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
              <View style={styles.postOverlay}>
                <View style={styles.postStats}>
                  <View style={styles.postStat}>
                    <Heart size={16} color="#ffffff" fill="#ffffff" />
                    <Text style={styles.postStatText}>{post.likes}</Text>
                  </View>
                  <View style={styles.postStat}>
                    <MessageCircle size={16} color="#ffffff" fill="#ffffff" />
                    <Text style={styles.postStatText}>{post.comments}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  username: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  settingsButton: {
    padding: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6c757d',
  },
  bioSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  displayName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  shareButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    padding: 8,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 2,
  },
  postItem: {
    width: POST_SIZE,
    height: POST_SIZE,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});