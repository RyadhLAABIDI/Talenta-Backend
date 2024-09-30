import express from 'express';
const router = express.Router(); // Notez l'utilisation de const ici
import { stat, statAppUsageRate } from '../Controller/statisticController.js';  // Assurez-vous de mettre le chemin correct

import { statistic } from '../Controller/statisticController.js';
import { statisti } from '../Controller/statisticController.js'; // Importez la fonction statistic depuis le contrôleur
//import { statBan } from '../Controller/statisticController.js';
// Définissez la route pour les statistiques
router.get('/statistic', statistic);
router.get('/statisti', statisti);
router.get('/stat', stat);
router.get('/statAppUsageRate', statAppUsageRate);
//router.get('/activeUserCount', ActiveUserCount)
export default router;
