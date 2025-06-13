// Configuração do banco de dados
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  async initialize() {
    try {
      this.db = await this.openDatabase();
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  async openDatabase() {
    const dbName = 'database.db';
    const dbUri = `${FileSystem.documentDirectory}SQLite/${dbName}`;
    const dir = `${FileSystem.documentDirectory}SQLite`;
    const fileExists = await FileSystem.getInfoAsync(dbUri);

    if (!fileExists.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      const asset = Asset.fromModule(require('../../assets/database.db'));
      await asset.downloadAsync();
      await FileSystem.copyAsync({
        from: asset.localUri,
        to: dbUri,
      });
    }

    return SQLite.openDatabaseAsync(dbName);
  }

  async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // Criar tabelas se não existirem
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS posts_cache (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        userId INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS users_cache (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async cachePosts(posts) {
    if (!this.db) throw new Error('Database not initialized');

    const insertQuery = `
      INSERT OR REPLACE INTO posts_cache (id, title, body, userId, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    for (const post of posts) {
      await this.db.runAsync(insertQuery, [
        post.id,
        post.title,
        post.body,
        post.userId,
      ]);
    }
  }

  async getCachedPosts() {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.getAllAsync(`
      SELECT * FROM posts_cache 
      ORDER BY updated_at DESC
    `);
  }

  async cacheUsers(users) {
    if (!this.db) throw new Error('Database not initialized');

    const insertQuery = `
      INSERT OR REPLACE INTO users_cache (id, name, username, email)
      VALUES (?, ?, ?, ?)
    `;

    for (const user of users) {
      await this.db.runAsync(insertQuery, [
        user.id,
        user.name,
        user.username,
        user.email,
      ]);
    }
  }

  async getCachedUsers() {
    if (!this.db) throw new Error('Database not initialized');

    return await this.db.getAllAsync('SELECT * FROM users_cache');
  }
}

export default new DatabaseManager();