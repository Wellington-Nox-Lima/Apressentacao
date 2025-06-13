// Serviço para comunicação com APIs externas
class ApiService {
  constructor(baseURL = 'https://jsonplaceholder.typicode.com') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Posts
  async getPosts(limit = 10, page = 1) {
    return this.request(`/posts?_limit=${limit}&_page=${page}`);
  }

  async getPost(id) {
    return this.request(`/posts/${id}`);
  }

  async createPost(postData) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  // Comments
  async getComments(postId) {
    return this.request(`/posts/${postId}/comments`);
  }
}

export default new ApiService();