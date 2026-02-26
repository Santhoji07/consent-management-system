'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const consentRoutes = require('./routes/consentRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/consent', consentRoutes);

app.listen(3000, () => {
    console.log('Backend running on port 3000');
});