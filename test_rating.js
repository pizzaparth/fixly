import mongoose from 'mongoose';
import { User } from './server/models/User.js';
import { RepairRequest } from './server/models/RepairRequest.js';

async function test() {
  await mongoose.connect('mongodb://localhost:27017/fixly');
  
  // Find a technician
  const tech = await User.findOne({ role: 'technician' });
  console.log('Technician:', tech.name, 'Current Rating:', tech.rating);

  // Create a dummy repair request
  const req = await RepairRequest.create({
    user: tech._id, // doesn't matter
    technician: tech._id,
    productCategory: 'Laptop',
    issueDescription: 'Test',
    estimatedCost: 500,
    status: 'completed',
  });
  console.log('Created request:', req._id);

  // Rate it
  req.rating = {
    score: 4,
    feedback: 'Good',
    ratedAt: new Date(),
  };
  await req.save();

  // Recalculate
  const allRatings = await RepairRequest.find({
    technician: tech._id,
    'rating.score': { $exists: true, $ne: null },
  });
  console.log('Found rated requests:', allRatings.length);

  const avgScore = allRatings.reduce((sum, r) => sum + r.rating.score, 0) / allRatings.length;
  console.log('Calculated Avg:', avgScore);

  await User.findByIdAndUpdate(tech._id, {
    rating: avgScore,
    ratingCount: allRatings.length,
  });

  const updatedTech = await User.findById(tech._id);
  console.log('Updated Technician Rating:', updatedTech.rating);

  mongoose.disconnect();
}
test().catch(console.error);
