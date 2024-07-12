const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// static
app.use(express.static('public'));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/users', userRoutes);

//index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
