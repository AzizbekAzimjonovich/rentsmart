const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
  getUsers,
  getAllListings,
  approveListing,
  rejectListing,
  deleteListing,
  getStats,
} = require('../controllers/adminController');

router.use(auth, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/listings', getAllListings);
router.patch('/listings/:id/approve', approveListing);
router.patch('/listings/:id/reject', rejectListing);
router.delete('/listings/:id', deleteListing);

module.exports = router;
