import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors()); 

const PORT = process.env.PORT || 5000;  // Port for the server

app.get('/api/fetchHindi', async (req, res) => {
  const { title, ep, type } = req.query;

  if (!title || (!ep && type !== 'movie')) {
    return res.status(400).json({ error: 'Missing title or ep/movie type in query' });
  }

  const cleanedTitle = decodeURIComponent(title)
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');

  const apiUrl = type === 'movie'
    ? `https://aniverse.top/src/ajax/hindi2.php?id=${encodeURIComponent(cleanedTitle)}`
    : `https://aniverse.top/src/ajax/hindi.php?id=${encodeURIComponent(cleanedTitle)}&ep=${ep}`;

  try {
    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Hindi servers', message: error.message });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
