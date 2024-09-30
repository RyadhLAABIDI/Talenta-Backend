export const authenticate = (req, res, next) => {
    // Vérifier si l'utilisateur est authentifié
    if (req.user) {
      // L'utilisateur est authentifié, continuer vers la prochaine étape
      next();
    } else {
      // L'utilisateur n'est pas authentifié, renvoyer une réponse d'erreur
      res.status(401).json({ message: 'Non autorisé' });
    }
  };
  
  module.exports = authenticate;