import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useMemo } from "react";
import { Cookies } from "react-cookie";
// Create an axios instance
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000",
//   headers: {
//     "Content-Type": "application/json", // change according header type accordingly
//   },
// });

//Add request interceptor to include token in header
// axiosInstance.interceptors.request.use(
//   (config) => {

//     console.log("Getting token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${jwt}`;
//       console.log("Got it");
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const token = localStorage.getItem("token");
//       console.log("Unauthorized. Redirecting to login...");
//     }
//     return Promise.reject(error);
//   }
// );
export default function BookList() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  //const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch books data using React Query
  const {
    data: books = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      try {
        //setIsAuthenticated(false);
        //console.log("Getting token from local storage...");
        //const token = localStorage.getItem("token");
        //console.log(token);
        console.log("here");
        const currCookies = new Cookies();
        const jwt = currCookies.get("jwt");
        console.log(jwt);
        const response = await axios.get("http://localhost:3000/books", {
          headers: {
            Authorization: `Bearer ${jwt}`, // Sending JWT in Authorization header
          },
        });

        //setIsAuthenticated(true);
        console.log(response.data);
        return response.data.books.slice(0, 10).map((book) => ({
          title: book.title || "Unknown Title",
          author: book.author_name?.join(", ") || "Unknown Author",
          publishYear: book.first_publish_year || "Unknown Year",
          isbn: book.isbn?.[0] || null,
          coverImage: book.cover_edition_key
            ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-L.jpg`
            : book.isbn
              ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`
              : null,
          publisher: book.publisher?.join(", ") || "Unknown Publisher",
          language: book.language?.join(", ") || "Unknown Language",
          key: book.key ? `https://openlibrary.org${book.key}` : null,
        }));
      } catch (err) {
        if (err.response && err.response.status === 401) {
          console.log("Unauthorized. Redirecting to login...");
          navigate("/"); // Redirect to login page
        }
        throw err; // Let React Query handle the error state
      }
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    cacheTime: 1000 * 60 * 10, // Cache persists for 10 minutes
  });

  // Filter books based on the search query
  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.publisher.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, books]);

  // Handle loading state
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching books. Please try again later.</div>;

  return (
    <div>
      <div className="flex items-center space-x-2 p-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          className="p-2 border border-indigo-600 rounded"
        />
      </div>

      <ul role="list" className="divide-y divide-gray-100">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <li
              key={index}
              className="flex justify-between gap-x-6 py-5 my-5 cursor-pointer border border-indigo-600 rounded hover:bg-indigo-100"
              onClick={() => navigate("/listInfo", { state: { book } })}
            >
              <div className="flex min-w-0 gap-x-4">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={`${book.title} cover`}
                    className="w-32 h-48 object-cover"
                  />
                ) : (
                  <p>No cover available</p>
                )}
                <div className="min-w-0 flex-auto">
                  <h2 className="text-sm font-semibold text-gray-900">
                    {book.title}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">{book.author}</p>
                  <p className="mt-1 text-xs text-gray-500">{book.publisher}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {book.publishYear}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{book.language}</p>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="p-4 text-gray-500">No books found.</p>
        )}
      </ul>
    </div>
  );
}
