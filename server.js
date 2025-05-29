require("dotenv").config();
const express = require("express");
const connectToDB = require('./config/mongodb');
const cors = require("cors");

const app = express();
connectToDB();

app.use(express.json());
app.use(cors());

const subscriptionRoutes = require('./routes/subscriptionRoutes');

app.use('/subscriptions', subscriptionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
