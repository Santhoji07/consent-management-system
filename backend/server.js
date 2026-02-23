'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const consentRoutes = require('./routes/consentRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// IMPORTANT: make sure consentRoutes is a router
app.use('/consent', consentRoutes);

app.listen(3000, () => {
    console.log('Backend running on port 3000');
});