import express from 'express';
import {
  addOtp,
  getAllOtp,
  verifyOtp
} from '../Controller/OtpController.js';

const router = express.Router();

// Route pour afficher le profil du talent
router.post('/add/', addOtp);

router.get('/all/', getAllOtp);

router.post('/verify', verifyOtp);


export default router;