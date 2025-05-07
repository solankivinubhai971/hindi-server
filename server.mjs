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

    // Validate input
    if (!rawTitle || !ep) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        message: 'Both title and episode (ep) parameters are required'
      });
    }

    const decodedTitle = decodeURIComponent(rawTitle);
    const safeTitle = encodeURIComponent(decodedTitle.toLowerCase().replace(/\s+/g, '-'));

    // Updated API endpoint
    const apiURL = `https://aniverse.top/src/ajax/hindi_combined.php?id=${safeTitle}&ep=${encodeURIComponent(ep)}`;
    console.log('Fetching from:', apiURL);

    const response = await axios.get(apiURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    });

    // Process the response
    if (response.data?.success && response.data?.hindi?.length) {
      // Transform the data to match your frontend expectations
      const servers = response.data.hindi.map(server => ({
        id: server.serverId,
        name: server.serverName,
        url: server.link
      }));

      return res.status(200).json(servers);
    } else {
      return res.status(404).json({ 
        error: 'No servers found',
        message: 'No Hindi servers available for this episode'
      });
    }

  } catch (error) {
    console.error('Fetch error:', error.message);
    
    // Enhanced error handling
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;
    
    return res.status(statusCode).json({
      error: 'Failed to fetch Hindi servers',
      message: errorMessage,
      details: error.response?.data || null
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`✅ Hindi server API running on port ${PORT}`);
});
