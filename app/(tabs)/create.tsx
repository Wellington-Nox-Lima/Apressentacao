import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Camera, Image as ImageIcon, X, Check } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de permissão para acessar sua câmera.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, adicione um título ao seu post.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Erro', 'Por favor, adicione um conteúdo ao seu post.');
      return;
    }

    setIsPublishing(true);

    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false);
      Alert.alert(
        'Sucesso!',
        'Seu post foi publicado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setContent('');
              setImage(null);
              router.push('/(tabs)');
            },
          },
        ]
      );
    }, 2000);
  };

  const isFormValid = title.trim() && content.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <X size={24} color="#6c757d" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova Publicação</Text>
          <TouchableOpacity 
            style={[
              styles.publishButton,
              isFormValid && styles.publishButtonActive,
              isPublishing && styles.publishButtonDisabled,
            ]}
            onPress={handlePublish}
            disabled={!isFormValid || isPublishing}
          >
            {isPublishing ? (
              <Text style={styles.publishButtonTextDisabled}>Publicando...</Text>
            ) : (
              <>
                <Check size={16} color={isFormValid ? "#ffffff" : "#adb5bd"} />
                <Text style={[
                  styles.publishButtonText,
                  isFormValid && styles.publishButtonTextActive
                ]}>
                  Publicar
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Adicione um título chamativo..."
                placeholderTextColor="#adb5bd"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
              <Text style={styles.charCount}>{title.length}/100</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Conteúdo</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Compartilhe sua história, dicas ou inspiração..."
                placeholderTextColor="#adb5bd"
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
                maxLength={500}
              />
              <Text style={styles.charCount}>{content.length}/500</Text>
            </View>

            <View style={styles.imageSection}>
              <Text style={styles.label}>Imagem</Text>
              
              {image ? (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: image }} style={styles.selectedImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                    <X size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageOptions}>
                  <TouchableOpacity style={styles.imageOption} onPress={pickImage}>
                    <ImageIcon size={32} color="#1DA1F2" />
                    <Text style={styles.imageOptionText}>Galeria</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.imageOption} onPress={takePhoto}>
                    <Camera size={32} color="#1DA1F2" />
                    <Text style={styles.imageOptionText}>Câmera</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
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
  },
  cancelButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
  },
  publishButtonActive: {
    backgroundColor: '#1DA1F2',
  },
  publishButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  publishButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#adb5bd',
    marginLeft: 4,
  },
  publishButtonTextActive: {
    color: '#ffffff',
  },
  publishButtonTextDisabled: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  contentInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#adb5bd',
    textAlign: 'right',
    marginTop: 4,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 32,
  },
  imageOption: {
    alignItems: 'center',
    padding: 16,
  },
  imageOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1DA1F2',
    marginTop: 8,
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 8,
  },
});