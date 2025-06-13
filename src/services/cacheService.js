import DatabaseManager from '../config/database';

class CacheService {
  async initializeCache() {
    try {
      await DatabaseManager.initialize();
    } catch (error) {
      console.error('Cache initialization failed:', error);
    }
  }

  async cachePosts(posts) {
    try {
      await DatabaseManager.cachePosts(posts);
    } catch (error) {
      console.error('Failed to cache posts:', error);
    }
  }

  async getCachedPosts() {
    try {
      return await DatabaseManager.getCachedPosts();
    } catch (error) {
      console.error('Failed to get cached posts:', error);
      return [];
    }
  }

  async cacheUsers(users) {
    try {
      await DatabaseManager.cacheUsers(users);
    } catch (error) {
      console.error('Failed to cache users:', error);
    }
  }

  async getCachedUsers() {
    try {
      return await DatabaseManager.getCachedUsers();
    } catch (error) {
      console.error('Failed to get cached users:', error);
      return [];
    }
  }
}

export default new CacheService();