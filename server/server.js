require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5500;
app.use(cors());

const API_KEY = process.env.API_KEY;
const SECRET = process.env.SECRET_KEY; 

const options = { 
  expiresIn: '120m', 
  algorithm: 'HS256' 
};

app.get('/get-token', (req, res) => {

  const payload = {
    apikey: API_KEY,
    permissions: ['allow_join','allow_mod','allow_rec','allow_upload','allow_chat','allow_hand','allow_rec_play']
  };

  const token = jwt.sign(payload, SECRET, options);
  res.json({ token });
  console.log(token);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
