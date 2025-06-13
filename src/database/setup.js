import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export async function openDatabase() {
  const dbName = 'database.db';
  const dbUri = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  const dir = `${FileSystem.documentDirectory}SQLite`;
  const fileExists = await FileSystem.getInfoAsync(dbUri);

  if (!fileExists.exists){
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