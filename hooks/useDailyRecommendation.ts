import { useEffect, useState } from 'react';
import { askAi } from '@/utils/ai';
import { BookOfTheDay } from '@/types/bookOfTheDay';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useDailyRecommendation = () => {
  const [completeBook, setCompleteBook] = useState<BookOfTheDay>();

  useEffect(() => {
    const askRecommendation = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const storageValue = await AsyncStorage.getItem('book-of-the-day');
        if (storageValue !== null) {
          const jsonValue = JSON.parse(storageValue);
          if (
            jsonValue.date === today &&
            jsonValue.title !== null &&
            jsonValue.reason !== null &&
            jsonValue.author !== null
          ) {
            setCompleteBook(jsonValue);
            return;
          }
        }
      } catch (e) {
        console.error('Error reading value from AsyncStorage: ', e);
      }

      const aiResult = await askAi({
        promptMessage: `Recommend ONE book for today. Return JSON only with:
         title, author, reason (1 sentence), genre.`,
      });
      console.log('AI RESULT:', aiResult);
      console.log('AI RESULT TYPE:', typeof aiResult);

      if (!aiResult) return;

      const cleanAiResult = aiResult
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const aiJsonValue = await JSON.parse(cleanAiResult);
      console.log('AI JSON:', aiJsonValue);

      const apiResult = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(aiJsonValue.title)}+inauthor:${encodeURIComponent(aiJsonValue.author)}`,
      );

      if (!apiResult.ok) {
        console.error('No book found in Google Books API: ', aiJsonValue.title);
      }
      const data = await apiResult.json();
      const cover = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
      console.log('GOOGLE BOOKS DATA:', data.items?.[0]?.volumeInfo);

      const completeData = {
        title: aiJsonValue.title,
        author: aiJsonValue.author,
        reason: aiJsonValue.reason,
        genre: aiJsonValue.genre,
        coverUrl: cover ?? null,
        date: today,
      };

      setCompleteBook(completeData);
      console.log('completed book: ', completeData);

      try {
        const jsonValue = JSON.stringify(completeData);
        await AsyncStorage.setItem('book-of-the-day', jsonValue);
      } catch (e) {
        console.error('Error adding book data to AsyncStorage: ', e);
      }
    };

    askRecommendation();
  }, []);

  return completeBook;
};
