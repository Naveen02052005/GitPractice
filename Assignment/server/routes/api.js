const express = require('express');
const router = express.Router();
const ensureAuth = require('../middleware/ensureAuth');
const Search = require('../models/Search');
const axios = require('axios');

router.post('/search', ensureAuth, async (req, res) => {
  const term = (req.body.term || '').trim();
  if (!term) return res.status(400).json({ error: 'term required' });

  try {
    await Search.create({ userId: req.user._id, term });

    const perPage = Math.min(parseInt(req.body.perPage) || 20, 40);
    const page = parseInt(req.body.page) || 1;
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query: term, per_page: perPage, page },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });

    const results = response.data.results.map(r => ({
      id: r.id,
      thumb: r.urls.thumb,
      small: r.urls.small,
      regular: r.urls.regular,
      alt: r.alt_description || r.description || '',
      link: r.links.html
    }));

    res.json({ term, total: response.data.total, results });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'Search failed' });
  }
});

router.get('/top-searches', async (req, res) => {
  try {
    const top = await Search.aggregate([
      { $group: { _id: '$term', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { term: '$_id', count: 1, _id: 0 } }
    ]);
    res.json({ top });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
});

router.get('/history', ensureAuth, async (req, res) => {
  try {
    const history = await Search.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
