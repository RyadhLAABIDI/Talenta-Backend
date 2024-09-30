// Ajoutez l'extension .mjs au nom du fichier
import express from 'express';
const router = express.Router();
import User from '../Models/Usermodel.js';
import Talent from '../Models/Talentmodel.js';



export const statistic = async (req, res) => {
    try {
      const userCount = await User.countDocuments({ role: 'user' });
      const talentCount = await User.countDocuments({ role: 'talent' });
  
      console.log('User Count:', userCount);
      console.log('Talent Count:', talentCount);
  
      res.json({ userCount, talentCount });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const statisti = async (req, res) => {
  try {
    // Comptez le nombre total d'utilisateurs
    const totalUserCount = await User.countDocuments();

    // Comptez le nombre d'utilisateurs ayant le rôle 'user'
    const userCount = await User.countDocuments({ role: 'user' });

    // Comptez le nombre d'utilisateurs ayant le rôle 'talent'
    const talentCount = await User.countDocuments({ role: 'talent' });

    // Calculez le pourcentage de talents et d'utilisateurs
    const percentageTalents = (talentCount / totalUserCount) * 100;
    const percentageUsers = (userCount / totalUserCount) * 100;

    console.log('Total User Count:', totalUserCount);
    console.log('User Count:', userCount);
    console.log('Talent Count:', talentCount);
    console.log('Percentage Talents:', percentageTalents);
    console.log('Percentage Users:', percentageUsers);

    res.json({
      totalUserCount,
      userCount,
      talentCount,
      percentageTalents,
      percentageUsers,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const stat = async (req, res) => {
  try {
    // Assurez-vous d'avoir une fonction appropriée pour récupérer le nombre d'utilisateurs bannis.
    const userBannedCount = await User.countDocuments({ role: 'user', banned: true });
    const talentBannedCount = await User.countDocuments({ role: 'talent', banned: true });

    // Journalisation des valeurs récupérées
    console.log('Nombre d\'utilisateurs bannis avec le rôle "user":', userBannedCount);
    console.log('Nombre d\'utilisateurs bannis avec le rôle "talent":', talentBannedCount);

    res.status(200).json({
      userBannedCount,
      talentBannedCount,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de bannissement:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques de bannissement.' });
  }
};


export const statAppUsageRate = async (req, res) => {
  try {
    // Récupérez le nombre total d'utilisateurs
    const totalUserCount = await User.countDocuments();

    // Obtenez la date d'il y a 7 jours à partir de la date actuelle
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);

    // Utilisateurs actifs sont ceux dont lastActive est supérieur à sevenDaysAgo
    const activeUserCount = await User.countDocuments({ lastActive: { $gt: sevenDaysAgo } });

    // Calcul du taux d'utilisation de l'application
    const appUsageRate = (activeUserCount / totalUserCount) * 100;

    // Journalisation des valeurs récupérées
    console.log('Nombre total d\'utilisateurs:', totalUserCount);
    console.log('Nombre d\'utilisateurs actifs au cours des 1 derniers jours:', activeUserCount);
    console.log('Taux d\'utilisation de l\'application:', appUsageRate);

    // Envoyer la réponse avec le taux d'utilisation de l'application
    res.status(200).json({
      appUsageRate,
    });
  } catch (error) {
    // Journalisation des erreurs
    console.error('Erreur lors du calcul du taux d\'utilisation de l\'application:', error);
    res.status(500).json({ error: 'Erreur lors du calcul du taux d\'utilisation de l\'application.' });
  }
};


