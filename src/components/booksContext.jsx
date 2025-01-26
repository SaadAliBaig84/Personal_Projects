import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create a context
const BooksContext = createContext();

// Custom hook to use the Books context
export const useBooks = () => {
  return useContext(BooksContext);
};

// BooksProvider component
export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if books data is already in localStorage
    const storedBooks = localStorage.getItem("booksData");

    if (storedBooks) {
      // If data is present in localStorage, use it
      setBooks(JSON.parse(storedBooks));
      setLoading(false);
    } else {
      // If no data in localStorage, fetch from API
      const fetchBooks = async () => {
        try {
          const response = await axios.get(
            "https://openlibrary.org/search.json?q=1984&limit=10"
          );
          const data = response.data.docs.slice(0, 10).map((book) => ({
            title: book.title || "Unknown Title",
            author: book.author_name?.join(", ") || "Unknown Author",
            publishYear: book.first_publish_year || "Unknown Year",
            isbn: book.isbn?.[0] || null,
            coverImage: book.isbn
              ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`
              : null,
            publisher: book.publisher?.join(", ") || "Unknown Publisher",
            language: book.language?.join(", ") || "Unknown Language",
            subjects: book.subject?.join(", ") || "No Subjects Available",
            firstSentence:
              book.first_sentence?.value || "No First Sentence Available",
            numberOfPages:
              book.number_of_pages_median || "Unknown Number of Pages",
            key: book.key ? `https://openlibrary.org${book.key}` : null,
            editionCount: book.edition_count || "Unknown Editions",
            olid: book.cover_edition_key || null,
            oclc: book.oclc || null,
            lccn: book.lccn || null,
          }));

          // Store books data in localStorage and state
          localStorage.setItem("booksData", JSON.stringify(data));
          setBooks(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching books:", error);
          setLoading(false); // Set loading to false even in case of an error
        }
      };

      fetchBooks();
    }
  }, []);

  return (
    <BooksContext.Provider value={{ books, loading }}>
      {children}
    </BooksContext.Provider>
  );
};
