// import express from 'express';
// import bodyParser from 'body-parser';
// import {dbConnect} from './models/psqlWrapper';
const express = require('express');
const bodyParser = require('body-parser');
const {dbConnect} = require('./models/psqlWrapper');
const cors=require('cors');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
dbConnect().then(
    ()=>{
        console.log("done");
    }
);
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
app.use("/auth", authRoutes);

app.listen(port, ()=>{console.log("Server running on port "+port)});