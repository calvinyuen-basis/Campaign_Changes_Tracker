const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/**
 * Example API route
 * This function sends an API request and returns the response
 */
app.get("/api/data", async (req, res) => {
  try {
    // Example external API call
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "API request failed",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});