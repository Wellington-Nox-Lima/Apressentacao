import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock data for posts
const generateMockPosts = () => {
  const posts = [];
  for (let i = 1; i <= 20; i++) {
    posts.push({
      id: i,
      user: {
        id: i,
        name: `Usuário ${i}`,
        username: `usuario${i}`,
        avatar: `https://images.pexels.com/photos/${1000 + i}/pexels-photo-${1000 + i}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
      },
      title: `Meu projeto de bordado ${i}`,
      content: `Acabei de terminar este lindo bordado! Levei algumas semanas para completar, mas o resultado ficou incrível. O que vocês acham? #bordado #artesanato #handmade`,
      image: `https://images.pexels.com/photos/${2000 + i}/pexels-photo-${2000 + i}.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop`,
      likes: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 50) + 5,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      liked: false,
    });
  }
  return posts;
};

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (!liked) {
        setLiked(true);
        setLikeCount(prev => prev + 1);
        heartScale.value = withSpring(1.2, {}, () => {
          heartScale.value = withSpring(1);
        });
        onLike && onLike(post.id, true);
      }
    });

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    if (newLiked) {
      heartScale.value = withSpring(1.2, {}, () => {
        heartScale.value = withSpring(1);
      });
    }
    
    onLike && onLike(post.id, newLiked);
  };

  const handleShare = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { Share } = require('react-native');
        await Share.share({
          message: `Confira este post: ${post.title}\n\n${post.content}`,
          title: post.title,
        });
      } else {
        // Web fallback
        if (navigator.share) {
          await navigator.share({
            title: post.title,
            text: post.content,
            url: window.location.href,
          });
        } else {
          Alert.alert('Compartilhar', 'Funcionalidade de compartilhamento não disponível');
        }
      }
      onShare && onShare(post.id);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return postTime.toLocaleDateString('pt-BR');
  };

  return (
    <Animated.View style={[styles.postCard, animatedStyle]}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.userHandle}>@{post.user.username}</Text>
        </View>
        <View style={styles.postMeta}>
          <Text style={styles.timestamp}>{formatTimeAgo(post.timestamp)}</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color="#6c757d" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postText}>{post.content}</Text>
      </View>

      <GestureDetector gesture={doubleTap}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: post.image }} style={styles.postImage} />
          <Animated.View style={[styles.heartOverlay, heartAnimatedStyle]}>
            <Heart 
              size={60} 
              color={liked ? "#e74c3c" : "rgba(255,255,255,0.8)"} 
              fill={liked ? "#e74c3c" : "transparent"}
            />
          </Animated.View>
        </View>
      </GestureDetector>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Animated.View style={heartAnimatedStyle}>
            <Heart 
              size={24} 
              color={liked ? "#e74c3c" : "#6c757d"} 
              fill={liked ? "#e74c3c" : "transparent"}
            />
          </Animated.View>
          <Text style={[styles.actionText, liked && styles.likedText]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onComment && onComment(post.id)}
        >
          <MessageCircle size={24} color="#6c757d" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share size={24} color="#6c757d" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPosts(generateMockPosts());
      setLoading(false);
    }, 1000);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, []);

  const handleLike = (postId, liked) => {
    console.log(`Post ${postId} ${liked ? 'curtido' : 'descurtido'}`);
  };

  const handleComment = (postId) => {
    console.log(`Comentar no post ${postId}`);
    Alert.alert('Comentários', 'Funcionalidade em desenvolvimento');
  };

  const handleShare = (postId) => {
    console.log(`Post ${postId} compartilhado`);
  };

  const renderPost = ({ item, index }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>BORDADO SOCIAL</Text>
      <TouchableOpacity style={styles.profileButton}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop' }}
          style={styles.headerAvatar}
        />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Nenhum post encontrado</Text>
      <Text style={styles.emptySubtext}>Seja o primeiro a compartilhar algo!</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando posts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1DA1F2']}
            tintColor="#1DA1F2"
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={posts.length === 0 ? styles.emptyList : styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 400, // Approximate height of each post
          offset: 400 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  profileButton: {
    padding: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#1DA1F2',
  },
  listContent: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  userHandle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6c757d',
  },
  postMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#adb5bd',
    marginBottom: 4,
  },
  moreButton: {
    padding: 4,
  },
  postContent: {
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 24,
  },
  postText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    lineHeight: 22,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  heartOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    opacity: 0.8,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6c757d',
  },
  likedText: {
    color: '#e74c3c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#adb5bd',
    textAlign: 'center',
  },
};