import express from 'express';
import { sendPasswordResetEmail, resetPassword, login, register, logout } from '../Controller/authController.js';

const router = express.Router();

// Route de réinitialisation du mot de passe  
router.post('/reset-password', resetPassword);

router.post('/sendPasswordResetEmail', sendPasswordResetEmail);

// Route de connexion
router.post('/login', login);

// Route d'inscription
router.post('/register', register); 

// Route de déconnexion
router.get('/logout', logout);





export default router;


