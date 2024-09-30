import express from 'express';
import {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfilById,
} from '../Controller/adminController.js';
import {
  getAllTalent,
  createTalentUser,
  getTalentUser,
  updateTalentUser,
  deleteTalentUser,
  banUser,
  
} from '../Controller/adminController.js';
import { getUser } from '../Controller/adminController.js';
import User from '../Models/Usermodel.js';
//import { checkUserRole } from '../Middlewares.js/Rolemiddleware.js';



const router = express.Router();

// Routes pour la gestion des utilisateurs
router.post('/createUser', createUser);
router.get('/getUser/:id', getUser);
router.get('/getAllUser', getAllUser);

router.put('/updateUser/:id', updateUser);

router.delete('/deleteUser/:id', deleteUser);

// Route pour la mise à jour du profil de l'administrateur

router.put('/updateProfilById/:id', updateProfilById);



// Créer un utilisateur talent
router.post('/createTalentUser', createTalentUser);

// Récupérer un utilisateur talent par son identifiant
router.get('/getTalentUser/:id', getTalentUser);
router.get('/getAllTalent', getAllTalent);

// Mettre à jour un utilisateur talent
router.put('/updateTalentUser/:id', updateTalentUser);

// Supprimer un utilisateur talent
router.delete('/talent/:id', deleteTalentUser);

// Exemple de route pour le bannissement
router.post('/ban/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    console.log('Tentative de bannissement de l\'utilisateur avec l\'e-mail:', userEmail);

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    user.banned = true;
    await user.save();

    console.log('Utilisateur banni avec succès');
    res.json({ message: 'Utilisateur banni avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du bannissement de l\'utilisateur' });
  }
});

export default router;
