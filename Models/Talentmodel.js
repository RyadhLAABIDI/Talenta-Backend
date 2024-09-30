import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const talentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Une adresse e-mail doit être fournie'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'Veuillez fournir une adresse e-mail valide'
    }
  },
  password: {
    type: String,
    required: [true, 'Un mot de passe doit être fourni'],
    minlength: [8, 'La longueur minimale du mot de passe est de 8 caractères']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'talent'],
    default: 'talent'
  },
  banned: { type: Boolean, default: false },
  resetPassword: {
    type: String,
    select: false
  },
  redirectUrl: {
    type: String,
    default: '/interface-talent'
  }
});

talentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

talentSchema.methods.comparePassword = async function (password) {
  const passwordMatch = await bcrypt.compare(password, this.password);
  const isTalent = this.role === 'talent';

  return passwordMatch && isTalent;
};


const Talent = mongoose.model('Talent', talentSchema);

export default Talent;