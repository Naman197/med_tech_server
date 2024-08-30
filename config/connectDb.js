// mongodb://modinaman5:<db_password>@<hostname>/?ssl=true&replicaSet=atlas-wjdf30-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
    // mongodb+srv://modinaman5:<db_password>@cluster0.yop9v.mongodb.net/
    // await mongoose.connect('mongodb+srv://modinaman5:12345@cluster0.rsmwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {

// const mongoose = require('mongoose');


// const connectDB = async () => {
//   try {
    
//         await mongoose.connect('mongodb+srv://modinaman5:12345@nam@cluster0.yop9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {  
//     useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('Error connecting to MongoDB:', err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');
// require('dotenv').config();

const connectDB = async () => {
  try {
    // const mongoURI = process.env.MONGO_URI || 'mongodb+srv://modinaman5:12345%40nam@cluster0.yop9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const mongoURI ='mongodb+srv://modinaman5:12345%40nam@cluster0.yop9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    await mongoose.connect(mongoURI, {  
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;


