import mongoose from 'mongoose';
import { User } from './server/models/User.js';
import { Listing } from './server/models/Listing.js';

async function runTests() {
  await mongoose.connect('mongodb://localhost:27017/fixly');
  console.log('Connected to DB');

  const users = await User.find({ role: 'technician' });
  let mismatches = 0;

  for (const user of users) {
    const listing = await Listing.findOne({ technician: user._id });
    if (!listing) continue;

    const prices = Object.values(listing.servicePrices ? Object.fromEntries(listing.servicePrices) : {});
    const expectedMin = prices.length > 0 ? Math.min(...prices) : 500;
    
    if (listing.priceRange.min !== expectedMin) {
      console.error(`Mismatch for shop ${user.name}: Expected min ${expectedMin}, but got ${listing.priceRange.min}`);
      mismatches++;
    }

    const specialties = user.specialties.slice().sort();
    const productTypes = listing.productTypes.slice().sort();

    if (JSON.stringify(specialties) !== JSON.stringify(productTypes)) {
      console.error(`Category mismatch for ${user.name}: User specialties [${specialties}] vs Listing productTypes [${productTypes}]`);
      mismatches++;
    }
  }

  if (mismatches === 0) {
    console.log('SUCCESS: All shop base quotes and categories are perfectly in sync between User and Listing collections.');
  } else {
    console.error(`FAILED: Found ${mismatches} mismatches.`);
  }

  mongoose.disconnect();
}

runTests().catch(console.error);
