// // const express = require('express');
// // const cors = require('cors');
// // const connectDB = require('./config/connectDb');
// // // const authRoutes = require('./routes/patients/AuthRoutes');
// // const retailInventoryRoute=require('./routes/retailers/inventory')
// // const retailAuthRoute=require('./routes/retailers/retailAuth')

// // const app = express();
// // const port = 3000;
// // connectDB();

// // app.use(cors({
// //     origin: '*', // Allow all origins
// //     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
// //     allowedHeaders: ['Content-Type', 'authorization'], // Allowed headers
// //   }));
  
  
// //   app.use(express.json());
// //  app.use('/api/retailer/inventory',retailInventoryRoute);
// //  app.use('/api/retailer/auth',retailAuthRoute);

// // app.get('/', (req, res) => {
// //   res.send('Hello World!');
// // });

// // app.listen(port, () => {

// //   console.log(`Server is running at http://localhost:${port}`);
// // });


// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/connectDb');
// // const authRoutes = require('./routes/patients/AuthRoutes');
// const retailInventoryRoute = require('./routes/retailers/inventory');
// const retailAuthRoute = require('./routes/retailers/retailAuth');

// const app = express();
// const port = 3000;

// connectDB();

// // CORS configuration
// app.use(cors({
//   origin: '*', // Allow all origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
// }));

// app.use(express.json());

// // Routes
// app.use('/api/retailer/inventory', retailInventoryRoute);
// app.use('/api/retailer/auth', retailAuthRoute);

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

const express = require('express');
   const cors = require('cors');
   const connectDB = require('./config/connectDb');
   const retailInventoryRoute = require('./routes/retailers/inventory');
   const retailAuthRoute = require('./routes/retailers/retailAuth');
   const retailOrderRoute = require('./routes/retailers/orderoutes');
   const manfAuthRoute = require('./routes/manufacturers/authroutes');
   const distributorsAuthRoute = require('./routes/distrubutors/authroutes');
   const manfinvroute = require('./routes/manufacturers/minventory');
   const manfOrders = require('./routes/manufacturers/orderRoutes');

   const dotenv = require('dotenv');

   
   dotenv.config();

   const app = express();
   const port = process.env.PORT || 3000;

   connectDB();

   app.use(cors({
     origin: '*',
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
   }));

   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));


   app.use('/api/manufacturers/inv',manfinvroute );

   app.use('/api/manufacturers/auth', manfAuthRoute);
   app.use('/api/manufacturers/orders', manfOrders);


   app.use('/api/distributors/auth',distributorsAuthRoute);


   app.use('/api/retailer/auth', retailAuthRoute);
   app.use('/api/retailer/inventory', retailInventoryRoute); // Protected route
   app.use('/api/retailer/order', retailOrderRoute); // Protected route





   app.get('/', (req, res) => {
     res.send('Hello World!');
   });

   app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).send('Something broke!');
   });

   app.listen(port, () => {
     console.log(`Server is running at http://localhost:${port}`);
   });