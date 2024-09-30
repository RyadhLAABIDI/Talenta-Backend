import User from '../Models/Usermodel.js';
import createError from 'http-errors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


export const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find();
if(user){
  res.json({
    status: 'success',
    results: user
  });
}
    if (!user) {
      return next(createError(404, 'Utilisateur non trouvé avec cet ID'));
    }

    
  } catch (err) {
    next(err);
  }
};


export const getUserByEmail = async (req, res, next) => {
  try {
    const userEmail = req.params.email;
    const updateData = req.body;

    
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return next(createError(404, 'Utilisateur non trouvé avec cet e-mail'));
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });

    res.status(200).json(updatedUser);   

  } catch (err) {
    next(err);
  }
};


export const getUser = async (req, res, next) => {
  try {
    console.log('Début de la fonction getUser');
    const user = await User.findById(req.params.id);

    if (!user) {
      console.log('Utilisateur non trouvé avec cet ID');
      return next(createError(404, 'Utilisateur non trouvé avec cet ID'));
    }

    console.log('Utilisateur trouvé:', user);

    res.json({
      status: 'success',
      user: {
        email: user.email,
        password: user.password
      }
    });
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la fonction getUser:', err);
    next(err);
  }
};


//NEW***********************************
export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    console.log('User updated successfully:', updatedUser);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};


export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw createError(404, 'User not found');
    }

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      throw createError(500, 'Error deleting user');
    }
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Error deleting user' });
  }
};
//*************************************** */



export const updateUser = async (req, res, next) => {
  try {
    // Vérification si l'utilisateur est authentifié et si l'objet req.user est défini
    if (req.user._id === req.params.id) {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!user) {
        return next(createError(404, 'Utilisateur non trouvé avec cet ID'));
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

export const update =(req, res, next)=>
{
    let userID=req.body.userID
    let updateData={
        email:req.body.email,
        password:req.body.password
    }
    User.findByIdAndUpdate(userID, {$set:updateData})
    .then(()=>{
        res.json( {
            message:'User updated successfully!'
        })
    })
.catch(error =>{
    res.json({
        message:'an error Occured!'
    })
})
}

export const deleteUser = async (req, res, next) => {
  try {
    if ((req.user && req.user._id === req.params.id) || (req.user && req.user.role === 'admin')) {
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      if (!deletedUser) {
        return next(createError(404, 'Utilisateur non trouvé avec cet ID'));
      }

      res.status(204).json({
        status: 'success'
      });
    } else {
      throw createError(401, 'Non autorisé');
    }
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    if (req.user && req.user._id === req.params.id) {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!updatedUser) {
        throw createError(404, 'Utilisateur non trouvé avec cet ID');
      }

      res.status(200).json({
        status: 'success',
        data: updatedUser
      });
    } else {
      throw createError(401, 'Non autorisé');
    }
  } catch (err) {
    next(err);
  }
};


