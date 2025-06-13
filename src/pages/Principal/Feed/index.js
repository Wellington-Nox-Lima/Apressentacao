import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList,
  RefreshControl,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { usePosts } from '../../../hooks/usePosts';
import PostCard from '../../../components/PostCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import ApiService from '../../../services/api';

import styles from './styles';

export default function Feed() {
  const navigation = useNavigation();
  const route = useRoute();
  const { usuario } = route.params || {};
  
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('feed');
  
  const {
    posts,
    loading,
    error,
    hasMore,
    refreshing,
    loadMorePosts,
    refreshPosts,
  } = usePosts();

  useEffect(() => {
    loadUsers();
    requestCameraPermission();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await ApiService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const requestCameraPermission = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      Alert.alert(
        "Permissões necessárias",
        "Precisamos de permissões para acessar sua câmera.",
        [{ text: "OK" }]
      );
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      navigation.navigate('Add', { image: result.assets[0].uri });
    }
  };

  const handleTabPress = (tab) => {
    if (tab === 'photo') {
      takePhoto();
    } else if (tab === 'add') {
      navigation.navigate('Add');
    } else {
      setActiveTab(tab);
    }
  };

  const handlePostLike = (postId, liked) => {
    console.log(`Post ${postId} ${liked ? 'curtido' : 'descurtido'}`);
  };

  const handlePostComment = (postId) => {
    console.log(`Comentar no post ${postId}`);
    // Navegar para tela de comentários
  };

  const handlePostShare = (postId) => {
    console.log(`Post ${postId} compartilhado`);
  };

  const getUserForPost = (userId) => {
    return users.find(user => user.id === userId) || users[0];
  };

  const renderPost = ({ item }) => (
    <PostCard
      post={item}
      user={getUserForPost(item.userId)}
      onLike={handlePostLike}
      onComment={handlePostComment}
      onShare={handlePostShare}
    />
  );

  const renderFooter = () => {
    if (!loading || posts.length === 0) return null;
    return <LoadingSpinner size="small" text="Carregando mais posts..." />;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="newspaper-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Nenhum post encontrado</Text>
        <Text style={styles.emptySubtext}>Seja o primeiro a publicar algo!</Text>
      </View>
    );
  };

  if (error && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>BORDADO SOCIAL</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Perfil', { usuario })}>
            <Image 
              source={require('../../../assets/profile.png')}
              style={styles.profilePic}
            />
          </TouchableOpacity>
        </View>
        <ErrorMessage message={error} onRetry={refreshPosts} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BORDADO SOCIAL</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil', { usuario })}>
          <Image 
            source={require('../../../assets/profile.png')}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feed' && styles.activeTab]}
          onPress={() => handleTabPress('feed')}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={activeTab === 'feed' ? "#1DA1F2" : "gray"} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === 'feed' && styles.activeTabText
          ]}>
            Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tab} 
          onPress={() => handleTabPress('add')}
        >
          <Ionicons name="create-outline" size={24} color="gray" />
          <Text style={styles.tabText}>Publicar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tab}
          onPress={() => handleTabPress('photo')}
        >
          <Ionicons name="camera-outline" size={24} color="gray" />
          <Text style={styles.tabText}>Foto</Text>
        </TouchableOpacity>
      </View>

      {loading && posts.length === 0 ? (
        <LoadingSpinner text="Carregando posts..." />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshPosts}
              colors={['#1DA1F2']}
              tintColor="#1DA1F2"
            />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={posts.length === 0 ? styles.emptyList : null}
        />
      )}
    </SafeAreaView>
  );
}