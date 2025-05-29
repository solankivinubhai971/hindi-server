import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/fetchHindi', async (req, res) => {
  try {
    const title = req.query.title || '';
    const ep = req.query.ep;

    if (!title || !ep) {
      return res.status(400).json({ error: 'Missing title or episode parameter' });
    }

    const apiURL = `https://aniverse.top/src/ajax/t.php?title=${encodeURIComponent(title)}&ep=${encodeURIComponent(ep)}`;

    console.log('Fetching from:', apiURL);

    const response = await axios.get(apiURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = response.data;

    // Check for success status
    if (data.status !== 'success') {
      return res.status(404).json({ error: 'No sources found' });
    }

    // Optionally: Only return the decoded embed URLs if needed
    const sources = data.dub_sources?.map(src => ({
      provider: src.decoded?.provider,
      url: src.decoded?.url_or_embed
    }));

    res.status(200).json({
      episode_url: data.episode_url,
      sources,
      cached: data.cached,
      timestamp: data.timestamp
    });

  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({
      error: 'Could not fetch Hindi dub data',
      message: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Hindi server API running on port ${PORT}`);
});
