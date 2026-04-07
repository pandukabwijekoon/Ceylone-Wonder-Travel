const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // Form fields
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  isLocal: { type: Boolean, default: false },
  
  // Specific fields
  nic: { type: String },
  nationality: { type: String },
  passport: { type: String },
  visaType: { type: String },
  
  // Booking Info
  destination: { type: String, required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  adults: { type: Number, required: true },
  roomType: { type: String, required: true },
  hotelName: { type: String, required: true },
  hotelPrice: { type: Number },
  totalPrice: { type: Number },
  requests: { type: String },
  
  bookingRef: { type: String, unique: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
