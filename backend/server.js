const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize } = require('./db');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

require('./models/User');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', authRoutes);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Loi ket noi database:", err);
});