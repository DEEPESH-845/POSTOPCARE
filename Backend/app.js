const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const logger = require('morgan');
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
connectDB();
const cors = require('cors');

// app.use((req, res, next) => {
//     res.header('Access-Control-Expose-Headers', 'Content-Disposition');
//     next();
// });

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));


app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

module.exports =app;