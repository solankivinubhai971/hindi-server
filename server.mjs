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

    if (!rawTitle) {
      return res.status(400).json({ error: 'Missing title parameter' });
    }

    const decodedTitle = decodeURIComponent(rawTitle);
    const safeTitle = encodeURIComponent(decodedTitle);

    // ✅ Auto-detect movies and remove ep
    const isMovie = decodedTitle.toLowerCase().includes('movie');

    const apiURL = (!isMovie && ep)
      ? `https://aniverse.top/src/ajax/hindi.php?id=${safeTitle}&ep=${encodeURIComponent(ep)}`
      : `https://aniverse.top/src/ajax/hindi2.php?id=${safeTitle}`;

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
