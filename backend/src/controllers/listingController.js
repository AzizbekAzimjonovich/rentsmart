const Listing = require('../models/Listing');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');

const toPublicUrls = (req, filenames) =>
  filenames.map((f) => `${req.protocol}://${req.get('host')}/uploads/${path.basename(f)}`);

exports.createListing = asyncHandler(async (req, res) => {
  const { title, price, address, rooms, description, contact, rentalType } = req.body;
  if (!title || price == null || !address || rooms == null || !description || !contact) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const files = req.files || [];
  const imagePaths = files.map((f) => f.filename);
  const listing = await Listing.create({
    title,
    price: Number(price),
    address,
    rooms: Number(rooms),
    description,
    contact,
    rentalType: rentalType || 'apartment',
    images: imagePaths,
    status: 'pending',
    createdBy: req.user._id,
  });
  const obj = listing.toObject();
  obj.images = toPublicUrls(req, obj.images);
  res.status(201).json({ success: true, listing: obj });
});

exports.getPublicListings = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const skip = (page - 1) * limit;
  const sort = req.query.sort || 'newest';
  const search = req.query.search?.trim();
  const minPrice = req.query.minPrice != null ? Number(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice != null ? Number(req.query.maxPrice) : null;
  const location = req.query.location?.trim();
  const rooms = req.query.rooms != null ? Number(req.query.rooms) : null;
  const rentalType = req.query.rentalType;

  const filter = { status: 'approved' };
  if (search) {
    filter.$text = { $search: search };
  }
  if (minPrice != null && !Number.isNaN(minPrice)) filter.price = { ...filter.price, $gte: minPrice };
  if (maxPrice != null && !Number.isNaN(maxPrice)) {
    filter.price = { ...filter.price, $lte: maxPrice };
  }
  if (location) {
    filter.address = new RegExp(location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }
  if (rooms != null && !Number.isNaN(rooms)) filter.rooms = rooms;
  if (rentalType && rentalType !== 'all') filter.rentalType = rentalType;

  let sortObj = { createdAt: -1 };
  if (sort === 'price_asc') sortObj = { price: 1 };
  if (sort === 'price_desc') sortObj = { price: -1 };
  if (sort === 'oldest') sortObj = { createdAt: 1 };

  const [items, total] = await Promise.all([
    Listing.find(filter)
      .sort(sortObj)
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

exports.getFeatured = asyncHandler(async (req, res) => {
  const limit = Math.min(8, parseInt(req.query.limit, 10) || 6);
  const items = await Listing.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name')
    .lean();
  items.forEach((l) => {
    l.images = (l.images || []).map(
      (img) =>
        `${req.protocol}://${req.get('host')}/uploads/${path.basename(img)}`
    );
  });
  res.json({ success: true, listings: items });
});

exports.getRecent = asyncHandler(async (req, res) => {
  const limit = Math.min(10, parseInt(req.query.limit, 10) || 5);
  const items = await Listing.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('createdBy', 'name')
    .lean();
  items.forEach((l) => {
    l.images = (l.images || []).map(
      (img) =>
        `${req.protocol}://${req.get('host')}/uploads/${path.basename(img)}`
    );
  });
  res.json({ success: true, listings: items });
});

exports.getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('createdBy', 'name email').lean();
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  if (listing.status !== 'approved') {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  listing.images = (listing.images || []).map(
    (img) =>
      `${req.protocol}://${req.get('host')}/uploads/${path.basename(img)}`
  );
  const similar = await Listing.find({
    _id: { $ne: listing._id },
    status: 'approved',
    $or: [{ rentalType: listing.rentalType }, { rooms: listing.rooms }],
  })
    .limit(4)
    .populate('createdBy', 'name')
    .lean();
  similar.forEach((l) => {
    l.images = (l.images || []).map(
      (img) =>
        `${req.protocol}://${req.get('host')}/uploads/${path.basename(img)}`
    );
  });
  res.json({ success: true, listing, similar });
});

exports.getMyListings = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 12);
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Listing.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Listing.countDocuments({ createdBy: req.user._id }),
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

exports.updateMyListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  const { title, price, address, rooms, description, contact, rentalType } = req.body;
  if (title != null) listing.title = title;
  if (price != null) listing.price = Number(price);
  if (address != null) listing.address = address;
  if (rooms != null) listing.rooms = Number(rooms);
  if (description != null) listing.description = description;
  if (contact != null) listing.contact = contact;
  if (rentalType != null) listing.rentalType = rentalType;
  const files = req.files || [];
  if (files.length) {
    const newNames = files.map((f) => f.filename);
    listing.images = [...(listing.images || []), ...newNames];
  }
  listing.status = 'pending';
  await listing.save();
  const obj = listing.toObject();
  obj.images = toPublicUrls(req, obj.images);
  res.json({ success: true, listing: obj });
});

exports.deleteMyListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Listing not found' });
  }
  res.json({ success: true, message: 'Listing deleted' });
});
