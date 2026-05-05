const User = require('../models/User');
const Listing = require('../models/Listing');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');

const mapImages = (req, listing) => {
  const l = listing.toObject ? listing.toObject() : { ...listing };
  l.images = (l.images || []).map(
    (img) => `${req.protocol}://${req.get('host')}/uploads/${path.basename(img)}`
  );
  return l;
};

exports.getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);
  res.json({
    success: true,
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

exports.getAllListings = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 12);
  const skip = (page - 1) * limit;
  const status = req.query.status;
  const filter = {};
  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    filter.status = status;
  }
  const [items, total] = await Promise.all([
    Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean(),
    Listing.countDocuments(filter),
  ]);
  items.forEach((l) => {
    l.images = (l.images || []).map(
      (img) =>
        `${req.protocol}://${req.get('host')}/uploads/${path.basename(img)}`
    );
  });
  res.json({
    success: true,
    listings: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

exports.approveListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status: 'approved' },
    { new: true }
  ).populate('createdBy', 'name email');
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, listing: mapImages(req, listing) });
});

exports.rejectListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true }
  ).populate('createdBy', 'name email');
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, listing: mapImages(req, listing) });
});

exports.deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, message: 'Listing deleted' });
});

exports.getStats = asyncHandler(async (_req, res) => {
  const [users, listings, pending, approved, rejected] = await Promise.all([
    User.countDocuments(),
    Listing.countDocuments(),
    Listing.countDocuments({ status: 'pending' }),
    Listing.countDocuments({ status: 'approved' }),
    Listing.countDocuments({ status: 'rejected' }),
  ]);
  res.json({
    success: true,
    stats: { users, listings, pending, approved, rejected },
  });
});
