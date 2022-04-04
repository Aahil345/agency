const express = require('express');
const bodyParser = require('body-parser');
const Router = require("./routes");
const port = process.env.PORT || 3000;

var app = express();

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(Router);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
