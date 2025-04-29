import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/fetchHindi', async (req, res) => {
  try {
    let { title, ep } = req.query;

    if (!title) {
      return res.status(400).json({ error: 'Missing title in query' });
    }

    // Check if episode is present -> anime, else movie
    let apiURL = '';

    if (ep) {
      // Fetch Anime Episode server (series)
      apiURL = `https://player.aniverse.top/src/ajax/hindi.php?id=${encodeURIComponent(title)}&ep=${ep}`;
    } else {
      // Fetch Movie server
      apiURL = `https://player.aniverse.top/src/ajax/hindi2.php?id=${encodeURIComponent(title)}`;
    }

    console.log(`Fetching from: ${apiURL}`);

    const response = await axios.get(apiURL);
    const data = response.data;

    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching Hindi server:', error.message);
    res.status(500).json({ error: 'Failed to fetch Hindi servers', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
