import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/Colors';

const AddBookModal = ({ route, navigation }) => {
  const { book, onGoBack } = route.params || {}; // book can be null for Add, or an object for Edit
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditMode = !!book;

  useEffect(() => {
    if (isEditMode && book) {
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn || '');
      setPublicationYear(book.publication_year?.toString() || '');
    }
    navigation.setOptions({ title: isEditMode ? 'Edit Book' : 'Add New Book' });
  }, [book, navigation, isEditMode]);

  const handleSubmit = async () => {
    if (!title || !author) {
      Alert.alert('Error', 'Title and Author are required.');
      return;
    }

    setLoading(true);
    const bookData = {
      user_id: user.id,
      title,
      author,
      isbn: isbn || null,
      publication_year: publicationYear ? parseInt(publicationYear, 10) : null,
    };

    let error;
    if (isEditMode) {
      const { error: updateError } = await supabase
        .from('books')
        .update(bookData)
        .match({ id: book.id, user_id: user.id });
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('books').insert([bookData]);
      error = insertError;
    }

    setLoading(false);

    if (error) {
      Alert.alert(`Error ${isEditMode ? 'updating' : 'adding'} book`, error.message);
    } else {
      Alert.alert('Success', `Book ${isEditMode ? 'updated' : 'added'} successfully!`);
      onGoBack && onGoBack(); // Call the callback to refresh the list
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., The Great Gatsby"
        placeholderTextColor={COLORS.mediumGray}
      />

      <Text style={styles.label}>Author *</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="e.g., F. Scott Fitzgerald"
        placeholderTextColor={COLORS.mediumGray}
      />

      <Text style={styles.label}>ISBN</Text>
      <TextInput
        style={styles.input}
        value={isbn}
        onChangeText={setIsbn}
        placeholder="e.g., 978-3-16-148410-0"
        placeholderTextColor={COLORS.mediumGray}
      />

      <Text style={styles.label}>Publication Year</Text>
      <TextInput
        style={styles.input}
        value={publicationYear}
        onChangeText={setPublicationYear}
        placeholder="e.g., 1925"
        placeholderTextColor={COLORS.mediumGray}
        keyboardType="numeric"
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primaryRed} style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title={isEditMode ? "Update Book" : "Add Book"} onPress={handleSubmit} color={COLORS.primaryRed} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.dirtyWhite,
  },
  label: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    color: COLORS.darkGray,
  },
  buttonContainer: {
    marginTop: 20,
  }
});

export default AddBookModal;