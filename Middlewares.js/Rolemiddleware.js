

  export const checkUserRole = (requiredRole) => {
    return (req, res, next) => {
      console.log('Rôle requis :', requiredRole);
      console.log('Rôle de l\'utilisateur :', req.user.role);
  
      if (req.user.role === requiredRole) {
        next();
      } else {
        console.log('Accès refusé : Rôle non correspondant');
        res.status(403).json({
          status: 'error',
          message: 'Accès refusé'
        });
      }
    };
  };
  

  
  