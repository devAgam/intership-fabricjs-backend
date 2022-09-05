require("dotenv").config();
const express = require("express");
const app = express();
const port = 42069;
const Joi = require("joi");
const { register, login, validateJWT } = require("./auth/auth.functions");
const { save, get } = require("./auth/draw.functions");
const InitiateMongoServer = require("./database/connect");
InitiateMongoServer();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const newUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
app.post("/login", async (req, res) => {
  const { error } = newUserSchema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const registerNonce = await register(req.body.username, req.body.password);
  if (registerNonce.login) {
    const loginNonce = await login(req.body.username, req.body.password);
    if (loginNonce.success) {
      res.status(loginNonce.status).send(loginNonce);
      return;
    }
    res.status(loginNonce.status).send(loginNonce);
    return;
  }
  res.status(registerNonce.status).send(registerNonce);
});

app.post("/", async function (req, res) {
  const userData = await validateJWT(req.headers.token);
  if (userData.success) {
    const drawNonce = await save(userData.id, req.body.json);
    res.status(drawNonce.status).send(drawNonce);
    return;
  }
  res.status(userData.status).send(userData);
});

app.get("/", async (req, res) => {
  const userData = await validateJWT(req.headers.token);
  if (userData.success) {
    const drawNonce = await get(userData.id);
    res.status(drawNonce.status).send(drawNonce);
    return;
  }
  res.status(userData.status).send(userData);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
