import express from 'express';
import {
  getTalentProfile,
  updateTalentProfile,
  deleteTalentProfile,
  updateTalentById,
  deleteTalentById,
  getTalent,
  updateTalent,
  deleteTalent
} from '../Controller/talentController.js';

const router = express.Router();

// Route pour afficher le profil du talent
router.get('/getTalentProfile/:id', getTalentProfile);

// Route pour mettre à jour le profil du talent
router.put('/updateTalentProfile/:id', updateTalentProfile);

// Route pour supprimer le profil du talent
router.delete('/deleteTalentProfile/:id', deleteTalentProfile);
router.get('/getTal/:id', getTalent);
//new
router.put('/talents/:id', updateTalentById);
router.delete('/talents/:talentId', deleteTalentById);
router.put('/updateTalent/:id', updateTalent);
router.delete('/deleteTalent/:id', deleteTalent);

export default router;