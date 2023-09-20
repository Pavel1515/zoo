const express = require("express")
const authRouter = express.Router();
const authControler = require('../controlers/authControler')

// Пути
authRouter.post('/',authControler.authentication);
authRouter.post('/registr',authControler.registerAndVerify);
authRouter.post('/verificate',authControler.verificate);

module.exports = authRouter;