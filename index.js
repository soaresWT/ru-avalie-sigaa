const express = require("express");
const bodyParser = require("body-parser");
const sigaa = require("./modules/sigaa");
const creditos = require("./modules/creditos");
const cardapio = require("./modules/cardapio");
const app = express();
var cors = require('cors');
app.use(cors({origin:true,credentials: true}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    } else {
        next();
    }
});

const config = {
  port: process.env.PORT || 3000,
};

app.get("/", (_, res) => {
  res.send("API para leitura remota de dados da Universidade Federal do Ceará");
});

app.post("/sigaa", (req, res) => {
  const { login, senha } = req.body;
  console.log(login, senha);
  sigaa.access(login, senha).then((response) => {
    res.send(sigaa.scrape(response, login));
  });
});

app.post("/creditos", (req, res) => {
  const { matricula, cartao } = req.body;
  creditos.access(cartao, matricula).then((result) => {
    res.send(creditos.scrape(result));
  });
});

app.get("/cardapio/:data?", (req, res) => {
  const data = req.params.data;
  cardapio.access(data).then((result) => {
    res.send(cardapio.scrape(result));
  });
});

module.exports = app;
