require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const email = process.env.ADMIN_EMAIL || 'admin@uzrent.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  const exists = await User.findOne({ email });
  if (exists) {
    if (exists.role !== 'admin') {
      exists.role = 'admin';
      await exists.save();
      console.log('Existing user promoted to admin:', email);
    } else {
      console.log('Admin already exists:', email);
    }
    await mongoose.disconnect();
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ name: 'Admin', email, password: hash, role: 'admin' });
  console.log('Admin created:', email);
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
