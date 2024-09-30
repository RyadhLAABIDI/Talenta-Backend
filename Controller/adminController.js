import User from '../Models/Usermodel.js';
import Talent from '../Models/Talentmodel.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';



export const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' });

    if (users.length > 0) {
      res.json({
        status: 'success',
        results: users
      });
    } else {
      return next(createError(404, 'Aucun utilisateur trouvé'));
    }
  } catch (err) {
    next(err);
  }
};


export const createUser = async (req, res, next) => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      role: 'user'
    });

    await newUser.save();

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, 'Utilisateur non trouvé avec cet identifiant'));
    }

    res.json({
      status: 'success',
      results: user
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Checking if the user is updating their own profile
    if (req.user._id === req.params.id) {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!user) {
        return next(createError(404, 'Utilisateur non trouvé avec cet identifiant'));
      }

      res.json({
        status: 'success',
        user
      });
    } else {
      throw createError(401, 'Non autorisé');
    }
  } catch (err) {
    next(err);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(createError(404, 'Utilisateur non trouvé avec cet identifiant'));
    }

    res.status(204).json({
      status: 'success'
    });
  } catch (err) {
    next(err);
  }
};

// Assumez que vous avez un middleware d'authentification qui définit req.user


export const updateProfilById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (updateData.password) {
      // Remplacez par votre logique de gestion du mot de passe
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (updatedUser) {
      // Mise à jour réussie
      console.log('Profil mis à jour avec succès');
      console.log('Nouvelles informations :', updatedUser);
      res.status(200).json({ message: 'Profil mis à jour avec succès', updatedUser });
    } else {
      // Aucun utilisateur trouvé avec l'ID donné
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
};






export const getAllTalent = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'talent' });

    if (users.length > 0) {
      res.json({
        status: 'success',
        results: users
      });
    } else {
      return next(createError(404, 'Aucun utilisateur trouvé'));
    }
  } catch (err) {
    next(err);
  }
};

// Créer un utilisateur talent

export const createTalentUser = async (req, res, next) => {
  try {
    const newTalentUser = new Talent({
      email: req.body.email,
      password: req.body.password,
      role: 'talent'
    });

    await newTalentUser.save();

    res.status(201).json({
      status: 'success',
      data: {
        user: newTalentUser
      }
    });
  } catch (err) {
    next(err);
  }
};


// Récupérer un utilisateur talent par son identifiant
export const getTalentUser = async (req, res, next) => {
  try {
    const talentUser = await Talent.findById(req.params.id); // Utilisation du modèle Talent pour récupérer un utilisateur talent

    if (!talentUser) {
      return next(createError(404, 'Utilisateur talent non trouvé avec cet identifiant'));
    }

    res.json({
      status: 'success',
      results: talentUser
    });
  } catch (err) {
    next(err);
  }
};

// Mettre à jour un utilisateur talent
export const updateTalentUser = async (req, res, next) => {
  try {
    const talentUser = await Talent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }); // Utilisation du modèle Talent pour mettre à jour un utilisateur talent

    if (!talentUser) {
      return next(createError(404, 'Utilisateur talent non trouvé avec cet identifiant'));
    }

    res.json({
      status: 'success',
      talentUser
    });
  } catch (err) {
    next(err);
  }
};

// Supprimer un utilisateur talent
export const deleteTalentUser = async (req, res, next) => {
  try {
    const deletedTalentUser = await Talent.findByIdAndDelete(req.params.id); // Utilisation du modèle Talent pour supprimer un utilisateur talent

    if (!deletedTalentUser) {
      return next(createError(404, 'Utilisateur talent non trouvé avec cet identifiant'));
    }

    res.status(204).json({
      status: 'success'
    });
  } catch (err) {
    next(err);
  }
};

export const banUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      console.log("L'utilisateur n'existe pas");
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    // Vérifier si l'utilisateur est déjà banni
    if (user.banned) {
      console.log("L'utilisateur est déjà banni");
      return res.status(400).json({ message: "L'utilisateur est déjà banni" });
    }

    // Bannir l'utilisateur
    user.banned = true;
    await user.save();

    console.log("L'utilisateur a été banni avec succès");

    // Envoyer l'identifiant de l'utilisateur dans la réponse
    return res.status(200).json({ message: "L'utilisateur a été banni avec succès", userId: user._id });
  } catch (error) {
    console.error(error);
    console.log("Une erreur est survenue lors du bannissement de l'utilisateur");
    return res.status(500).json({ message: "Une erreur est survenue lors du bannissement de l'utilisateur" });
  }
};



// ...