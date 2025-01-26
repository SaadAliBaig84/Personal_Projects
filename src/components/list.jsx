import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pointer } from "lucide-react";
import { useBooks } from "./booksContext";

export default function BookList() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]); // Initialize state to hold books data
  const navigate = useNavigate();
  useEffect(() => {
    // Check if books data is already in localStorage
    const storedBooks = sessionStorage.getItem("booksData");

    if (storedBooks) {
      // If data is present in localStorage, use it
      setBooks(JSON.parse(storedBooks));
      setLoading(false);
    } else {
      // If no data in localStorage, fetch from API
      const fetchBooks = async () => {
        try {
          const response = await axios.get(
            "https://openlibrary.org/search.json?q=b&limit=10"
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
              Array.isArray(book.first_sentence) &&
              book.first_sentence.length > 0
                ? book.first_sentence[0]
                : "No First Sentence Available",
            numberOfPages:
              book.number_of_pages_median || "Unknown Number of Pages",
            key: book.key ? `https://openlibrary.org${book.key}` : null,
            editionCount: book.edition_count || "Unknown Editions",
            olid: book.cover_edition_key || null,
            oclc: book.oclc || null,
            lccn: book.lccn || null,
          }));

          // Store books data in localStorage and state
          sessionStorage.setItem("booksData", JSON.stringify(data));
          setBooks(data);
          console.log(data[0].firstSentence);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching books:", error);
          setLoading(false); // Set loading to false even in case of an error
        }
      };

      fetchBooks();
    }
  }, []);
  // useEffect(() => {
  //   const fetchBooks = async () => {
  //     const response = await axios.get(
  //       "https://openlibrary.org/search.json?q=1984&limit=10"
  //     );
  //     console.log(response.data);
  //     const data = response.data;

  //     // Extract and format the book data
  //     const books = data.docs.slice(0, 10).map((book) => ({
  //       title: book.title || "Unknown Title",
  //       author: book.author_name?.join(", ") || "Unknown Author",
  //       publishYear: book.first_publish_year || "Unknown Year",
  //       isbn: book.isbn?.[0] || null,
  //       coverImage: book.isbn
  //         ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`
  //         : null,
  //       publisher: book.publisher?.join(", ") || "Unknown Publisher",
  //       language: book.language?.join(", ") || "Unknown Language",
  //       subjects: book.subject?.join(", ") || "No Subjects Available",
  //       firstSentence:
  //         book.first_sentence?.value || "No First Sentence Available",
  //       numberOfPages: book.number_of_pages_median || "Unknown Number of Pages",
  //       key: book.key ? `https://openlibrary.org${book.key}` : null,
  //       editionCount: book.edition_count || "Unknown Editions",
  //       olid: book.cover_edition_key || null,
  //       oclc: book.oclc || null,
  //       lccn: book.lccn || null,
  //     }));

  //     setBooks(books); // Update the books state
  //     setLoading(false);
  //     console.log(books);
  //   };
  //   if (books.length === 0) {
  //     fetchBooks();
  //   }
  // }, []);

  // const { books, loading } = useBooks();
  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  if (!books) {
    return <div>No data available</div>; // Handle empty state if data is not available
  }
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {books.map((book) => (
        <li
          key={book.isbn}
          className="flex justify-between gap-x-6 py-5 cursor-pointer"
          onClick={() => navigate("/listInfo", { state: { book } })}
        >
          <div className="flex min-w-0 gap-x-4">
            {book.isbn ? (
              <img
                src={
                  book.olid
                    ? `https://covers.openlibrary.org/b/olid/${book.olid}-M.jpg`
                    : book.isbn
                      ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
                      : "fallback-image.jpg"
                }
                alt={`${book.title} cover`}
                className="w-32 h-48 object-cover"
              />
            ) : (
              <p>No cover available</p>
            )}
            <div className="min-w-0 flex-auto">
              <h2 className="text-sm/6 font-semibold text-gray-900">
                {book.title}
              </h2>
              <p className="mt-1 truncate text-xs/5 text-gray-500">
                {book.author}
              </p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">
                {book.publisher}
              </p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">
                {book.publishYear}
              </p>

              <p className="mt-1 truncate text-xs/5 text-gray-500">
                {book.language}
              </p>
            </div>
          </div>
          {/* <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm/6 text-gray-900">{person.role}</p>
            {person.lastSeen ? (
              <p className="mt-1 text-xs/5 text-gray-500">
                Last seen{" "}
                <time dateTime={person.lastSeenDateTime}>
                  {person.lastSeen}
                </time>
              </p>
            ) : (
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs/5 text-gray-500">Online</p>
              </div>
            )}
          </div> */}
        </li>
      ))}
    </ul>
  );
}
