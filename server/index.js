const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const movieRoutes = require('./routes/movies.js');
const tvRoutes = require('./routes/tv_series.js');
const baseRoutes = require('./routes/base.js');
const postRoutes = require('./routes/post.js');
const userRoutes = require('./routes/user.js');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({limit: "30mb", extendet: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extendet: true}));
app.use(cors()); 

app.use('/movie', movieRoutes);
app.use('/tv', tvRoutes);
app.use('/post', postRoutes);
app.use('/user', userRoutes);
app.use('', baseRoutes);

app.get('/', (req, res) => {
    res.send('APP IS RUNNING NOW.');
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));