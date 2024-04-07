const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5500;
app.use(cors());


//Go to VideoSDK dashboard and get your API key and secret from API section after signup
const API_KEY = "Add your API key";
const SECRET = "Add yor secret";

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
