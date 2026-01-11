import { View, Text, StyleSheet, Image } from 'react-native';
import { useDailyRecommendation } from '@/hooks/useDailyRecommendation';

const BookOfTheDay = () => {
  const bookRecommendation = useDailyRecommendation();
  const bookCover =
    bookRecommendation?.coverUrl === null
      ? require('../assets/images/default-book-cover.png')
      : { uri: bookRecommendation?.coverUrl };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book of the Day</Text>
      <View style={styles.wrapper}>
        <Image source={bookCover} style={styles.bookCover} />
        {bookRecommendation && (
          <View style={styles.textContainer}>
            <Text style={styles.bookTitle}>{bookRecommendation.title}</Text>
            <Text style={styles.bookReason}>{bookRecommendation.reason}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DBEEEC',
    width: 340,
    alignItems: 'center',
    marginHorizontal: 'auto',
    marginTop: 20,
    borderRadius: 20,
    padding: 10,

    // iOS shadow
    shadowColor: '#9999A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.75,
    shadowRadius: 4,

    // Android shadow
    elevation: 4,
  },
  wrapper: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  title: {
    fontFamily: 'Marcellus',
    fontSize: 20,
  },
  bookCover: {
    width: 120,
    aspectRatio: 2 / 3,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  textContainer: {
    flexShrink: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontFamily: 'AndadaPro',
    marginBottom: 5,
  },
  bookReason: {
    fontSize: 16,
  },
});

export default BookOfTheDay;
