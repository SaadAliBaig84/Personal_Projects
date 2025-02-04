const axios = require("axios");

const getPaginatedBooks = async (req, res) => {
  console.log("here");
  const { page = 1, pageSize = 10 } = req.query;
  console.log(req.query);
  try {
    // Fetch books with pagination
    console.log("getting books");
    const response = await axios.get(
      "https://openlibrary.org/search.json?q=b&limit=10",
      {
        params: {
          page: page,
          limit: pageSize, // this controls the number of books per page
        },
      }
    );
    console.log(response.data);
    // Return paginated data
    res.status(200).json({
      books: response.data.docs,
      page: Number(page),
      pageSize: Number(pageSize),
      total: response.data.num_found,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Error fetching books from Open Library API");
  }
};

module.exports = { getPaginatedBooks };
