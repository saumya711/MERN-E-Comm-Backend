const express = require("express");

const router = express.Router();

const { createOrUpdateUser } = require("../controllers/authController");
const { authCheck } = require("../middlewares/authMiddleware");

const myMiddleware = (req, res, nextt) => {
    console.log("IM A MIDDLEWARE YAY");
    nextt();
};

router.post("/create-or-update-user", authCheck, createOrUpdateUser);

router.get("/testing", myMiddleware, (req, res) =>{
    res.json({
        data: "YOU HAVE SUCCESSFULLY TRIED MIDDLEWARE"
    });
});
module.exports = router;