const express = require("express");

const router = express.Router();

router.get("/create-or-update-user", (req, res) => {
    res.json({
        data: "hey you hit create-or-update-user API rndpoint",
    });
});

module.exports = router;