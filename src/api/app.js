let express = require('express');
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser');
let cors = require('cors');
let logger = require('morgan');
let path = require('path');

let app = express();
let root = process.cwd().substring(0, process.cwd().length - 8)
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

let ApiRouter = require('./routes/api');
app.use('/api', ApiRouter);

app.listen(port, () => {
    console.log(`Server listening on port::${port}`);
});

module.exports = app;
