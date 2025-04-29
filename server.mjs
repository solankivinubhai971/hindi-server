import express from 'express';
import axios from 'axios';
import cors from 'cors';  // Import CORS package

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (adjust for specific origins if needed)
app.use(cors());

app.get('/api/fetchHindi', async (req, res) => {
  try {
    let { title, ep } = req.query;

    if (!title) {
      return res.status(400).json({ error: 'Missing title in query' });
    }

    // Decide API URL: if episode is given => hindi.php, else => hindi2.php
    let apiURL = ep
      ? `https://aniverse.top/src/ajax/hindi.php?id=${encodeURIComponent(title)}&ep=${ep}`
      : `https://aniverse.top/src/ajax/hindi2.php?id=${encodeURIComponent(title)}`;

    console.log(`Fetching: ${apiURL}`);

    const response = await axios.get(apiURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',  // Basic fake UA, not mandatory here
        'Accept': 'application/json, text/plain, */*',
      }
    });

    const data = response.data;
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching Hindi server:', error.message);
    res.status(500).json({ error: 'Failed to fetch Hindi servers', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Hindi server API running on port ${PORT}`);
});
