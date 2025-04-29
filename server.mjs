import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors()); 

const PORT = process.env.PORT || 5000;  // Port for the server

// Route to fetch Hindi server data
app.get('/api/fetchHindi', async (req, res) => {
  const { title, episode } = req.query;  // Get title and episode from query
  const cleanedTitle = title.split('-')[0];  // Clean the title

  try {
    // Request data from the Hindi server
    const response = await axios.get(`https://aniverse.top/src/ajax/hindi.php?id=${encodeURIComponent(cleanedTitle)}&ep=${episode}`);
    const data = response.data;

    // Send the data back to the client
    res.status(200).json(data);
  } catch (error) {
    // Send error response if the fetch fails
    res.status(500).json({ error: 'Failed to fetch Hindi servers', message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
