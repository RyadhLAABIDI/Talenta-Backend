import User from '../Models/Usermodel.js';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from'jsonwebtoken';



export const sendPasswordResetEmail = async (user) => {
  // Générer le jeton de réinitialisation
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Enregistrer le jeton dans la base de données
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 heure d'expiration

  try {
    await user.save();
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de l'enregistrement du jeton de réinitialisation");
  }

  // Envoyer l'email de réinitialisation
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com', // Remplacez par le serveur SMTP approprié
    port: 587,
    secure: false,
    auth: {
      user: 'riadhlabidi690@gmail.com', // Remplacez par votre adresse email
      pass: 'agai rcen bntr fzfn', // Remplacez par votre mot de passe
    }
  });

  const mailOptions = {
    from: 'riadhlabidi690@gmail.com', // Remplacez par votre adresse email
    to: user.email,
    subject: 'Réinitialisation du mot de passe',
    text: 'Voici votre lien de réinitialisation de mot de passe : ' + resetToken,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé : ' + info.response);
  } catch (error) {
    console.error(error);
    throw new Error("Erreur lors de l'envoi de l'email de réinitialisation");
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Rechercher l'utilisateur avec le jeton de réinitialisation
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    // Vérifier si l'utilisateur existe et si le jeton est valide
    if (!user) {
      throw createError(400, 'Le jeton de réinitialisation est invalide ou a expiré');
    }

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Le mot de passe a été réinitialisé avec succès' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe' });
  }
};

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });

    if (!user) {
      throw createError(401, "Email invalide User not exist!");
    }

    // Vérifier si l'utilisateur est banni
    if (user.banned) {
      console.log("Tentative de connexion d'un utilisateur banni :", email);
      throw createError(401, "Vous êtes banni et ne pouvez pas vous connecter.");
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("password issue");
      throw createError(401, "Mot de passe invalide");
    }

    // Log de l'ID de l'utilisateur avant de générer les tokens
    console.log("ID de l'utilisateur connecté :", user._id);

    // Log du rôle de l'utilisateur
    console.log("Rôle de l'utilisateur :", user.role);

    // Générer un token d'authentification en utilisant signAccessToken
    const token = signAccessToken(user._id);

    // Générer le refresh token
    const refreshToken = generateRefreshToken(user._id);

    // Afficher le token et le refresh token dans la console
    console.log("Token d'authentification :", token);
    console.log("Refresh Token :", refreshToken);

    // Envoyer les informations de l'utilisateur dans la réponse
    res.json({
      success: true,
      userId: user._id,
      userEmail: user.email,
      userPassword: user.password,
      userRole: user.role, // Ajouter cette ligne
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({
        message: error.message || "Une erreur est survenue lors de la connexion"
      });
  }
};


  

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Vérifier si l'utilisateur est déjà banni
const bannedUser = await User.findOne({ email, banned: true });
if (bannedUser) {
  console.log("L'utilisateur est banni et ne peut pas s'inscrire à nouveau");
  return res.status(403).json({ message: "Vous êtes banni et ne pouvez pas vous inscrire à nouveau" });
}

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Cet utilisateur existe déjà");
      return res.status(409).json({ message: "Cet utilisateur existe déjà" });
    }

    // Vérifier si le rôle est valide (user, talent ou admin)
    if (role.toUpperCase() !== 'USER' && role.toUpperCase() !== 'TALENT' && role.toUpperCase() !== 'ADMIN') {
      console.log("Le rôle spécifié n'est pas valide");
      return res.status(400).json({ message: "Le rôle spécifié n'est pas valide" });
    }

    // Créer un nouvel utilisateur avec le rôle spécifié
    const newUser = new User({ email, password, role });
    await newUser.save();

    console.log("Utilisateur créé avec succès");
    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    console.log("Une erreur est survenue lors de l'inscription");
    res.status(error.statusCode || 500).json({ message: error.message || "Une erreur est survenue lors de l'inscription" });
  }
};


export const logout = (req, res) => {
  console.log("Received logout request"); // Ajoutez cette ligne pour vérifier si la requête atteint le serveur
  
  // Détruire la session de l'utilisateur
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err); // Ajoutez cette ligne pour loguer les erreurs
      res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    } else {
      console.log("Session destroyed successfully"); // Ajoutez cette ligne pour indiquer que la session a été détruite avec succès
      
      res.clearCookie('connect.sid'); // Supprimer le cookie de session
      console.log("Session cookie cleared"); // Ajoutez cette ligne pour indiquer que le cookie de session a été supprimé
      
      res.status(200).json({ message: 'Déconnexion réussie' });
    }
  });
};

// Dans votre authController.js

// Fonction pour bannir un utilisateur


const signAccessToken = (userId) => {
  const token = jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
  return token;
}


const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ userId }, 'your_refresh_secret_key', { expiresIn: '7d' });
  return refreshToken;
};