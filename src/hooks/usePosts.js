import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/api';

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = useCallback(async (pageNumber = 1, isRefresh = false) => {
    if (loading && !isRefresh) return;
    
    setLoading(true);
    setError(null);

    try {
      const newPosts = await ApiService.getPosts(10, pageNumber);
      
      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      if (isRefresh || pageNumber === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
      
      setPage(pageNumber);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  const loadMorePosts = useCallback(() => {
    if (hasMore && !loading) {
      loadPosts(page + 1);
    }
  }, [hasMore, loading, page, loadPosts]);

  const refreshPosts = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadPosts(1, true);
  }, [loadPosts]);

  useEffect(() => {
    loadPosts(1);
  }, []);

  return {
    posts,
    loading,
    error,
    hasMore,
    refreshing,
    loadMorePosts,
    refreshPosts,
  };
};