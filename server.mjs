import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/fetchHindi', async (req, res) => {
  try {
    const rawTitle = req.query.title || '';
    const ep = req.query.ep;

    // Ensure the title and episode are present
    if (!rawTitle || !ep) {
      return res.status(400).json({ error: 'Missing title or episode parameter' });
    }

    const decodedTitle = decodeURIComponent(rawTitle);
    const safeTitle = encodeURIComponent(decodedTitle);

    // Only fetch anime data (assuming ep is required for anime)
    const apiURL = `https://aniverse.top/src/ajax/hindi.php?id=${safeTitle}&ep=${encodeURIComponent(ep)}`;

    console.log('Fetching from:', apiURL);

    const response = await axios.get(apiURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({
      error: 'Could not fetch Hindi server',
      message: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Hindi server API running on port ${PORT}`);
});
