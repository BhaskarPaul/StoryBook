const router = require("express").Router();
const { ensureAuthentication, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story.model");

router.get("/", ensureGuest, (req, res) => {
    res.render("login", {
        layout: "login",
    });
});

router.get("/dashboard", ensureAuthentication, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean();
        res.render("dashboard", {
            name: req.user.firstName,
            stories,
        });
    } catch (e) {
        console.log(e);
        res.render("error/500");
    }
});

module.exports = router;
