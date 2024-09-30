import express from 'express';
import { getUserByEmail,deleteUserById,updateUserById,update,getAllUser,getUser, updateUser, deleteUser, updateProfile } from '../Controller/userController.js';

const router = express.Router();

router.put('/user/:email', getUserByEmail);


router.get('/getall/', getAllUser);

// Route pour obtenir les informations d'un utilisateur
router.get('/getUser/:id', getUser);

// Route pour mettre à jour un utilisateur
//router.put('/updateUser/:id', updateUser);
router.put('/updateUser/:userID', update);

// Route pour supprimer un utilisateur
router.delete('/deleteUser/:id', deleteUser);

// Route pour mettre à jour le profil d'un utilisateur
router.put('/updateProfile/:id', updateProfile);

// Route pour réinitialiser le mot de passe d'un utilisateur

//new
router.put('/users/:id', updateUserById);
router.delete('/users/:userId', deleteUserById);


export default router;

