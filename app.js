const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();

// 配置静态文件目录
app.use(express.static('public'));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/users', userRoutes);

// 如果没有其他路由处理请求，则默认显示 index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));