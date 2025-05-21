import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // To refresh data when screen is focused
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/Colors';

const BookItem = ({ item, onDelete, onEdit }) => (
  <View style={styles.bookItemContainer}>
    <View style={styles.bookInfo}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
      {item.created_at && <Text style={styles.bookDetails}>Year: {new Date(item.created_at).getFullYear()}</Text>}
      {item.isbn && <Text style={styles.bookDetails}>ISBN: {item.isbn}</Text>}
    </View>
    <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={() => onEdit(item)} style={[styles.actionButton, styles.editButton]}>
        <Text style={styles.actionButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={[styles.actionButton, styles.deleteButton]}>
        <Text style={styles.actionButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const BookListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  const fetchBooks = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id) // Only fetch books for the current user
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error fetching books', error.message);
      console.error('Error fetching books:', error);
    } else {
      setBooks(data);
    }
    setLoading(false);
  };

  // useFocusEffect is like useEffect but runs when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [user]) // Re-run if user changes (e.g., after login)
  );

  useEffect(() => {
    // Add AddBook button to header
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('AddBookModal', { book: null, onGoBack: fetchBooks })}
          title="Add"
          color={Platform.OS === 'ios' ? COLORS.white : COLORS.primaryRed} // iOS header buttons take tintColor
        />
      ),
      headerLeft: () => (
        <Button
          onPress={async () => {
            const { error } = await signOut();
            if (error) Alert.alert("Sign Out Error", error.message);
          }}
          title="Logout"
          color={Platform.OS === 'ios' ? COLORS.white : COLORS.primaryRed}
        />
      )
    });
  }, [navigation, signOut]);


  const handleDeleteBook = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from('books').delete().match({ id: id, user_id: user.id });
            if (error) {
              Alert.alert('Error deleting book', error.message);
            } else {
              setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
              Alert.alert('Success', 'Book deleted successfully.');
            }
          }
        }
      ]
    );
  };

  const handleEditBook = (book) => {
    navigation.navigate('AddBookModal', { book: book, onGoBack: fetchBooks });
  };


  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" color={COLORS.primaryRed} />;
  }

  if (books.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No books yet. Add your first one!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <BookItem item={item} onDelete={handleDeleteBook} onEdit={handleEditBook} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dirtyWhite,
  },
  listContainer: {
    padding: 10,
    backgroundColor: COLORS.dirtyWhite,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.mediumGray,
  },
  bookItemContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  bookInfo: {
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  bookAuthor: {
    fontSize: 15,
    color: COLORS.mediumGray,
    marginBottom: 5,
  },
  bookDetails: {
    fontSize: 13,
    color: COLORS.mediumGray,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 10,
    marginTop: 5,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: COLORS.accentRed,
  },
  deleteButton: {
    backgroundColor: COLORS.mediumGray,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default BookListScreen;