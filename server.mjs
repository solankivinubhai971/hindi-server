import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors()); 

const PORT = process.env.PORT || 5000;  // Port for the server

// Route to fetch Hindi server data
app.get('/api/fetchHindi', async (req, res) => {
  const { title, episode } = req.query;

  if (!title || !episode) {
    return res.status(400).json({ error: 'Missing title or episode in query' });
  }

  // Keep only alphabets and spaces
  const cleanedTitle = decodeURIComponent(title)
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');

  try {
    const response = await axios.get(`https://aniverse.top/src/ajax/hindi.php?id=${encodeURIComponent(cleanedTitle)}&ep=${episode}`);
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Hindi servers', message: error.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
