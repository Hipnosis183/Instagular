const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
require('dotenv').config()

const app = express();
const root = process.cwd().substring(0, process.cwd().length - 8)
const port = 3200

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: [process.env.CORS_ORIGIN], credentials: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(`${root}/dist/instagram/`));

app.get('/', (req, res) => {
    res.sendFile(`${root}/dist/instagram/index.html`)
});

const ApiRouter = require('./routes/api');
app.use('/api', ApiRouter);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}/`);
});

module.exports = app;
