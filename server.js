const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { getSecret } = require('./secrets');
const userRoutes = require('./routes/userRoutes');
const paymentsRoute = require('./routes/paymentRoutes');

mongoose.Promise = global.Promise;
mongoose.connect(getSecret('dbUri')).then(
  () => console.log('Connected to mongoDB'),
  (err) => console.error('Error connecting to mongoDB', err),
);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/v1/authenticate', userRoutes);
app.use('/v1/payments', paymentsRoute);

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = { app };