const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors');
const { readdirSync } = require('fs')
require('dotenv').config();

// import routes
//const authRoutes = require("./routes/authRoutes");

// app
const app = express()

// db
// mongoose
//     .connect(process.env.MONGO_URL, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: true,
//     })
//     .then(() => console.log("DB CONNECTED"))
//     .catch((err) => console.log("DB CONNECTION ERR", err));

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.log("DB CONNECTION ERR", err));

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb"}));
app.use(cors());

// route middleware
//app.use("/api", authRoutes);

// routes autoloading
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

//port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

