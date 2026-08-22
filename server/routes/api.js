import express from 'express';
import { User, Listing, RepairRequest } from '../models/index.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/auth/register', async (req, res) => {
  try {
    const { email, name, password, role = 'consumer', location, phone, specialties } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashedPassword,
      role,
      location: location || {},
      phone: phone || '',
      specialties: specialties || [],
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        rating: user.rating,
        ratingCount: user.ratingCount,
        specialties: user.specialties,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ error: `Account exists but is not registered as a ${role}` });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        rating: user.rating,
        ratingCount: user.ratingCount,
        specialties: user.specialties,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/technicians', async (req, res) => {
  try {
    const { category, city } = req.query;
    const query = { role: 'technician' };

    if (category) {
      query.specialties = { $regex: category, $options: 'i' };
    }
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    const technicians = await User.find(query).select('-password').lean();
    
    for (let t of technicians) {
      const requests = await RepairRequest.find({
        technician: t._id,
        'rating.score': { $exists: true, $ne: null }
      })
      .sort({ 'rating.ratedAt': -1 })
      .limit(5)
      .populate('user', 'name')
      .lean();

      t.feedback = requests.map(r => ({
        id: r._id,
        author: r.user?.name || 'Customer',
        rating: r.rating.score,
        text: r.rating.feedback,
        date: r.rating.ratedAt ? new Date(r.rating.ratedAt).toLocaleDateString() : 'Recent',
      }));
    }

    res.json(technicians);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const { category, technicianId } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    if (technicianId) {
      query.technician = technicianId;
    }

    const listings = await Listing.find(query)
      .populate('technician', 'name email location rating ratingCount')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/listings', async (req, res) => {
  try {
    const { technicianId, category, productTypes, title, description, priceRange, estimatedTurnaround } = req.body;

    const listing = await Listing.create({
      technician: technicianId,
      category,
      productTypes: productTypes || [],
      title,
      description,
      priceRange,
      estimatedTurnaround,
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/listings/technician/:techId', async (req, res) => {
  try {
    const { services } = req.body; // e.g. { Laptop: 500, Mobile: 600 }
    const categories = Object.keys(services);
    const prices = Object.values(services);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 500;
    
    await Listing.findOneAndUpdate(
      { technician: req.params.techId },
      { 
        productTypes: categories,
        servicePrices: services,
        'priceRange.min': minPrice 
      }
    );

    await User.findByIdAndUpdate(req.params.techId, {
      specialties: categories
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/technicians/:id/rate', async (req, res) => {
  try {
    const { score } = req.body;
    
    const request = await RepairRequest.create({
      user: req.body.userId || req.params.id, // Fallback if no user
      technician: req.params.id,
      productCategory: 'Direct Rating',
      issueDescription: 'Direct Rating',
      estimatedCost: 0,
      status: 'completed',
      rating: {
        score: Number(score),
        feedback: '',
        ratedAt: new Date(),
      }
    });

    const allTechnicianRatings = await RepairRequest.find({
      technician: req.params.id,
      'rating.score': { $exists: true, $ne: null },
    });

    const totalRatings = allTechnicianRatings.length;
    const avgScore = totalRatings > 0 
      ? allTechnicianRatings.reduce((sum, r) => sum + r.rating.score, 0) / totalRatings 
      : 0;

    await User.findByIdAndUpdate(req.params.id, {
      rating: parseFloat(avgScore.toFixed(1)),
      ratingCount: totalRatings,
    });

    res.json({ success: true, avgScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/requests', async (req, res) => {
  try {
    const { userId, technicianId, listingId, productCategory, productName, issueDescription } = req.body;

    const request = await RepairRequest.create({
      user: userId,
      technician: technicianId,
      listing: listingId,
      productCategory,
      productName,
      issueDescription,
      status: 'pending',
    });

    const populated = await RepairRequest.findById(request._id)
      .populate('user', 'name email phone')
      .populate('technician', 'name email location rating');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/requests', async (req, res) => {
  try {
    const { userId, technicianId, status } = req.query;
    const query = {};

    if (userId) query.user = userId;
    if (technicianId) query.technician = technicianId;
    if (status) query.status = status;

    const requests = await RepairRequest.find(query)
      .populate('user', 'name email phone')
      .populate('technician', 'name email location rating')
      .populate('listing')
      .sort({ updatedAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/requests/:id/accept', async (req, res) => {
  try {
    const { exactPrice, submissionDate, submissionTimeSlot, estimatedDuration, returnDate, returnTimeSlot, technicianNotes } = req.body;

    const request = await RepairRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'accepted',
        quote: {
          exactPrice,
          submissionDate: submissionDate ? new Date(submissionDate) : undefined,
          submissionTimeSlot,
          estimatedDuration,
          returnDate: returnDate ? new Date(returnDate) : undefined,
          returnTimeSlot,
          technicianNotes,
          quotedAt: new Date(),
        },
      },
      { new: true }
    )
      .populate('user', 'name email phone')
      .populate('technician', 'name email location');

    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/requests/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    const request = await RepairRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: reason || 'Technician is unable to service this item currently.',
      },
      { new: true }
    );

    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/requests/:id/status', async (req, res) => {
  try {
    const { status, paymentConfirmed } = req.body;

    const updateData = { status };
    if (typeof paymentConfirmed === 'boolean') {
      updateData.paymentConfirmed = paymentConfirmed;
    }

    const request = await RepairRequest.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('user', 'name email phone')
      .populate('technician', 'name email location');

    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/requests/:id/review', async (req, res) => {
  try {
    const { score, feedback } = req.body;

    const request = await RepairRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.rating = {
      score: Number(score),
      feedback,
      ratedAt: new Date(),
    };
    await request.save();

    const allTechnicianRatings = await RepairRequest.find({
      technician: request.technician,
      'rating.score': { $exists: true, $ne: null },
    });

    const totalRatings = allTechnicianRatings.length;
    const avgScore =
      totalRatings > 0
        ? allTechnicianRatings.reduce((sum, r) => sum + r.rating.score, 0) / totalRatings
        : 0;

    await User.findByIdAndUpdate(request.technician, {
      rating: parseFloat(avgScore.toFixed(1)),
      ratingCount: totalRatings,
    });

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
