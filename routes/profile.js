const router = require("express").Router();
const { ensureAuthentication, ensureGuest } = require("../middleware/auth");
const User = require("../models/User.model");

router.get("/", ensureAuthentication, async (req, res) => {
    const user = await User.findById(req.user._id).lean();
    if (user) {
        res.render("profile", { user });
    } else {
        res.render("error/404");
    }
});

module.exports = router;
