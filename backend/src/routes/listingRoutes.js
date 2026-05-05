const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../utils/upload');
const {
  createListing,
  getPublicListings,
  getFeatured,
  getRecent,
  getListingById,
  getMyListings,
  updateMyListing,
  deleteMyListing,
} = require('../controllers/listingController');

router.get('/public', getPublicListings);
router.get('/featured', getFeatured);
router.get('/recent', getRecent);
router.get('/public/:id', getListingById);

router.post('/', auth, upload.array('images', 8), createListing);
router.get('/mine', auth, getMyListings);
router.patch('/mine/:id', auth, upload.array('images', 8), updateMyListing);
router.delete('/mine/:id', auth, deleteMyListing);

module.exports = router;
