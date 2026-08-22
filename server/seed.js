import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Listing } from './models/Listing.js';
import { RepairRequest } from './models/RepairRequest.js';
import { dummyShops, dummyOrders } from '../src/data/mockData.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixly';

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Listing.deleteMany({});
    await RepairRequest.deleteMany({});
    console.log('Cleared existing collections');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const consumers = {};
    for (const o of dummyOrders) {
      if (!consumers[o.customerEmail]) {
        const user = await User.create({
          name: o.customerName,
          email: o.customerEmail,
          password: hashedPassword,
          role: 'consumer',
          phone: o.mobile,
          location: { address: o.address },
        });
        consumers[o.customerEmail] = user._id;
      }
    }
    
    if (!consumers['priya@gmail.com']) {
      const user = await User.create({
        name: 'Priya Reddy',
        email: 'priya@gmail.com',
        password: hashedPassword,
        role: 'consumer',
      });
      consumers['priya@gmail.com'] = user._id;
    }

    const shopMap = {};
    for (const shop of dummyShops) {
      const email = shop.name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@fixly.local';
      const tech = await User.create({
        name: shop.owner,
        email,
        password: hashedPassword,
        role: 'technician',
        phone: shop.mobile,
        location: { address: shop.address },
        rating: shop.rating,
        ratingCount: shop.reviewCount,
        specialties: shop.categories,
      });

      shopMap[shop.id] = { _id: tech._id, name: shop.name, dummy: shop };

      await Listing.create({
        technician: tech._id,
        category: shop.categories[0] || 'General',
        title: shop.name,
        priceRange: { min: shop.estCost, max: shop.estCost + 500 },
        description: `Listing for ${shop.name}`,
      });
    }

    for (const o of dummyOrders) {
      const techInfo = shopMap[o.shopId];
      if (!techInfo) continue;
      
      const userId = consumers[o.customerEmail];
      const listing = await Listing.findOne({ technician: techInfo._id });
      
      let status = o.status;
      if (status === 'ongoing') status = 'in_progress';
      
      await RepairRequest.create({
        user: userId,
        technician: techInfo._id,
        listing: listing ? listing._id : null,
        productCategory: o.item,
        productName: o.item,
        issueDescription: o.issue,
        status: status,
        quote: {
          exactPrice: o.price,
        },
        rating: o.rating ? {
          score: o.rating.score,
          feedback: o.rating.feedback,
          ratedAt: new Date(),
        } : undefined
      });
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
