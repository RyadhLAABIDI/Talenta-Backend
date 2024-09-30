import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://laabidiryadh:ryadh1@cluster0.zsh66ak.mongodb.net/?retryWrites=true&w=majority', {
      
    });
    console.log('Connexion à la base de données établie');
  } catch (err) {
    console.log(err);

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connecté à la base de données');
    });
    mongoose.connection.on('error', (err) => {
      console.log('Erreur de connexion à la base de données:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('La connexion Mongoose à la base de données est interrompue');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  }
};

export default connectDB;

