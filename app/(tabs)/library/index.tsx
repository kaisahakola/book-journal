import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFetchAllBooks } from '@/hooks/useFetchAllBooks';
import React, { useEffect, useState } from 'react';
import { BookWithIdAndDate } from '@/types/book';
import BookItem from '@/components/BookItem';
import { Feather } from '@expo/vector-icons';

const Library = () => {
  const { books } = useFetchAllBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedBooks, setSortedBooks] = useState<BookWithIdAndDate[]>([]);

  useEffect(() => {
    if (!books) return;
    const booksSorted = [...books].sort(sortBooksByDate);
    setSortedBooks(booksSorted);
  }, [books]);

  const sortBooksByDate = (a: BookWithIdAndDate, b: BookWithIdAndDate) => {
    const dateA = new Date(a.createdAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? 0).getTime();

    return dateB - dateA;
  };

  const filteredBooks = sortedBooks.filter((book) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#66666E" />
        <TextInput
          placeholder="Search by title or author"
          placeholderTextColor="#66666E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookItem book={item} />}
        contentContainerStyle={{ paddingBottom: 90 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F6',
  },
  header: {
    fontFamily: 'Marcellus',
    fontSize: 32,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 12,
    width: '92%',
    marginHorizontal: 'auto',
    marginBottom: 10,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',

    // iOS shadow
    shadowColor: '#9999A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    // Android shadow
    elevation: 4,
  },
});

export default Library;
