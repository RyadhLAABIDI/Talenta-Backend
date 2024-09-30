import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
  }, 
  otp_code: {
    type: String,
  },
});



const Otp = mongoose.model('Otp', otpSchema);
export default Otp;