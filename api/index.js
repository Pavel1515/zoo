const express = require('express');
const cors = require('cors')
const sequelize = require("./db");
const app = express();
const port = 9000;
const Ads = require('./models/Ads')
const User = require('./models/User')

app.use(cors())
app.use(express.json());

app.use('/auth',require('./rotes/authRouter'));


const start = async () => {
    try {

        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(port, () => {
            console.log(`server start of port  ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();