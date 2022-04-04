const express = require('express');
const bodyParser = require('body-parser');
const Router = require("./routes");

var app = express();

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(Router);

app.listen(3000, () => {
    console.log('listening on port 3000');
});
