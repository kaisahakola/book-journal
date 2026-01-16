export type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
  };
};

export type GoogleBooksResponse = {
  items: GoogleBook[];
};

export type BookApiData = {
  id: string;
  title: string;
  author?: string;
  genre: string;
  thumbnail?: string | null;
  publishedDate?: string;
};
