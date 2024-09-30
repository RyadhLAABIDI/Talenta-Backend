import express from 'express';
import {
  addTest,
  getAllTests
} from '../Controller/TestController.js';

const router = express.Router();

// Route pour afficher le profil du talent
router.post('/add/', addTest);

router.get('/all/', getAllTests);


export default router;