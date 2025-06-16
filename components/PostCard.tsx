import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { Heart, MessageCircle, Share as ShareIcon, MoreHorizontal } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  timestamp: string;
  liked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: number, liked: boolean) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

export default function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likes);
  
  const heartScale = useSharedValue(1);

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
        await Share.share({
          message: `Confira este post: ${post.title}\n\n${post.content}`,
          title: post.title,
        });
      } else {
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return postTime.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.postCard}>
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
          <ShareIcon size={24} color="#6c757d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  postCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
    alignItems: 'flex-end' as const,
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
    marginBottom: 16,
  },
  postImage: {
    width: '100%' as const,
    height: 240,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  postActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
};