const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const batimentsRoutes = require('./routes/batimentsRoutes');
const sallesRoutes = require('./routes/sallesRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/batiments', batimentsRoutes);
app.use('/api/salles', sallesRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});