const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDb');
// const authRoutes = require('./routes/patients/AuthRoutes');
const retailInventoryRoute=require('./routes/retailers/inventory')
const app = express();
const port = 3000;
connectDB();

app.use(cors());
app.use(express.json());
 app.use('/api/retailer/inventory',retailInventoryRoute);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {

  console.log(`Server is running at http://localhost:${port}`);
});
