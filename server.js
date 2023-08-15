const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();

// app
const app = express()

// db
mongoose.connect(process.env.MONGO_URL)
