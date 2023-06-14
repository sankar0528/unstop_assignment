const mongoose=require('mongoose');

// Create a schema and model for seat reservations
const reservationSchema = new mongoose.Schema({
    seatNumbers: [String],
  });
  
  const Reservation = mongoose.model('Reservation', reservationSchema);
  module.exports=Reservation;