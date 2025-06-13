import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

const PostCard = ({ post, user, onLike, onComment, onShare }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100));

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike && onLike(post.id, !liked);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Confira este post: ${post.title}\n\n${post.body}`,
        title: post.title,
      });
      
      if (result.action === Share.sharedAction) {
        onShare && onShare(post.id);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o post');
    }
  };

  const handleComment = () => {
    onComment && onComment(post.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: `https://picsum.photos/40/40?random=${user?.id || 1}` }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.handle}>@{user?.username || 'usuario'}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.body}>{post.body}</Text>
        
        <Image 
          source={{ uri: `https://picsum.photos/400/200?random=${post.id}` }}
          style={styles.postImage}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={24} 
            color={liked ? "#e74c3c" : "#666"} 
          />
          <Text style={[styles.actionText, liked && styles.likedText]}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.actionText}>
            {Math.floor(Math.random() * 20)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCard;