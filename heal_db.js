import mongoose from 'mongoose';
import { User } from './server/models/User.js';
import { Listing } from './server/models/Listing.js';

async function heal() {
  await mongoose.connect('mongodb://localhost:27017/fixly');
  
  const users = await User.find({ role: 'technician' });
  for (const user of users) {
    const listing = await Listing.findOne({ technician: user._id });
    if (!listing) continue;

    // Merge categories
    const categories = Array.from(new Set([...user.specialties, ...listing.productTypes]));
    
    // Merge prices
    const services = listing.servicePrices ? Object.fromEntries(listing.servicePrices) : {};
    categories.forEach(c => {
      if (!services[c]) services[c] = listing.priceRange.min || 500;
    });

    const prices = Object.values(services);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 500;

    await Listing.findByIdAndUpdate(listing._id, {
      productTypes: categories,
      servicePrices: services,
      'priceRange.min': minPrice
    });

    await User.findByIdAndUpdate(user._id, {
      specialties: categories
    });
  }
  
  console.log('Database healed!');
  mongoose.disconnect();
}

heal().catch(console.error);
