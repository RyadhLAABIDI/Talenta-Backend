import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const testSchema = new mongoose.Schema({
  email: {
    type: String,
  }, 
  username: {
    type: String,
  },
});



const Test = mongoose.model('Test', testSchema);
export default Test;