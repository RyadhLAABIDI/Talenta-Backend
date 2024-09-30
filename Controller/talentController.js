import Talent from '../Models/Talentmodel.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import User from '../Models/Usermodel.js';


export const getTalentProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return next(createError(403, 'Accès refusé'));
    }
    const talentUser = await Talent.findById(req.params.id);
    if (!talentUser) {
      return next(createError(404, 'Utilisateur talent non trouvé avec cet identifiant'));
    }
    if (talentUser.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Accès refusé'));
    }
    res.json({
      status: 'success',
      results: talentUser
    });
  } catch (err) {
    next(err);
  }
};

export const updateTalentProfile = async (req, res, next) => {
  try {
    const talentId = req.params.id;
    const talentUser = await Talent.findByIdAndUpdate(talentId, req.body, {
      new: true,
      runValidators: true
    });

    if (!talentUser) {
      const error = createError(404, 'Profil talent non trouvé');
      return next(error);
    }

    if (!req.user || !req.user._id || talentUser.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Accès refusé'));
    }

    res.json({
      status: 'success',
      results: talentUser
    });
  } catch (err) {
    next(err);
  }
};



export const deleteTalentProfile = async (req, res, next) => {
  try {
    const talentId = req.params.id;
    const talent = await Talent.findById(talentId);

    if (!talent) {
      return next(createError(404, 'Profil talent non trouvé'));
    }

    if (talent.user.toString() !== req.user._id.toString()) {
      return next(createError(403, 'Accès refusé'));
    }

    await Talent.findByIdAndDelete(talentId);

    res.status(204).json({
      status: 'success'
    });
  } catch (err) {
    next(err);
  }
};


export const getTalent = async (req, res) => {
  const talentId = req.params.id;

  try {
    // Recherche du talent dans la base de données par ID
    const talent = await User.findById(talentId);

    if (talent) {
      // Afficher toutes les informations de l'utilisateur dans la console
      console.log('Informations de l\'utilisateur:', talent);

      // Afficher tous les messages de l'utilisateur dans la console (ajustez cela selon la structure de votre modèle de données)
      if (talent.messages && talent.messages.length > 0) {
        console.log('Messages de l\'utilisateur:', talent.messages);
      } else {
        console.log('L\'utilisateur n\'a pas de messages.');
      }

      // Envoyer les informations à la réponse JSON
      res.json({ user: talent });
    } else {
      res.status(404).json({ error: 'Talent not found' });
    }
  } catch (error) {
    console.error('Erreur lors de la recherche du talent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//NEW***********************************
export const updateTalentById = async (req, res) => {
  try {
    console.log('Début de la fonction updateTalentById');
    
    const talentId = req.params.id;
    console.log('ID du talent:', talentId);

    const updateData = req.body;
    console.log('Données de mise à jour reçues:', updateData);

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
      console.log('Mot de passe mis à jour:', updateData.password);
    }

    const updatedTalent = await Talent.findByIdAndUpdate(talentId, updateData, { new: true });
    console.log('Talent mis à jour avec succès:', updatedTalent);

    res.status(200).json(updatedTalent);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du talent:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du talent' });
  }
};



export const deleteTalentById = async (req, res) => {
  try {
    const talentId = req.params.talentId;

    const talent = await Talent.findById(talentId);

    if (!talent) {
      throw createError(404, 'talent not found');
    }

    const result = await Talent.deleteOne({ _id: talentId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Talent deleted successfully' });
    } else {
      throw createError(500, 'Error deleting Talent');
    }
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Error deleting Talent' });
  }
};
//*************************************** */

export const updateTalent = async (req, res) => {
  const talentId = req.params.id;
  const { newEmail, newPassword } = req.body;

  try {
    // Recherche du talent dans la base de données par ID
    const talent = await User.findById(talentId);

    if (talent) {
      // Afficher les informations actuelles de l'utilisateur dans la console
      console.log('Informations actuelles de l\'utilisateur avant la mise à jour:', talent);

      // Mettre à jour l'email et le mot de passe si les nouvelles valeurs sont fournies
      if (newEmail) {
        talent.email = newEmail;
      }
      if (newPassword) {
        talent.password = newPassword;
      }

      // Enregistrement des modifications dans la base de données
      await talent.save();

      // Afficher les informations mises à jour de l'utilisateur dans la console
      console.log('Informations de l\'utilisateur après la mise à jour:', talent);

      // Envoyer les informations mises à jour à la réponse JSON
      res.json({ user: talent });
    } else {
      res.status(404).json({ error: 'Talent not found' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du talent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTalent = async (req, res) => {
  const talentId = req.params.id;

  try {
    // Recherche du talent dans la base de données par ID
    const talent = await User.findById(talentId);

    if (talent) {
      // Afficher les informations de l'utilisateur avant la suppression dans la console
      console.log('Informations de l\'utilisateur avant la suppression:', talent);

      // Suppression de l'utilisateur de la base de données
      await talent.deleteOne();

      // Afficher un message dans la console indiquant que l'utilisateur a été supprimé
      console.log('Utilisateur supprimé avec succès.');

      // Envoyer une réponse JSON indiquant que l'utilisateur a été supprimé
      res.json({ message: 'Utilisateur supprimé avec succès.' });
    } else {
      // Si l'utilisateur n'est pas trouvé, renvoyer une réponse JSON avec une erreur 404
      res.status(404).json({ error: 'Talent not found' });
    }
  } catch (error) {
    // En cas d'erreur lors de la suppression, afficher l'erreur dans la console
    console.error('Erreur lors de la suppression du talent:', error);
    
    // Envoyer une réponse JSON avec une erreur 500 en cas d'erreur interne du serveur
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

