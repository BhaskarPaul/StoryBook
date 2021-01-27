const router = require("express").Router();
const { ensureAuthentication, ensureGuest } = require("../middleware/auth");
const Story = require("../models/Story.model");

router.get("/add", ensureAuthentication, (req, res) => {
    res.render("stories/add");
});

router.post("/", ensureAuthentication, async (req, res) => {
    try {
        req.body.user = req.user._id;
        await Story.create(req.body);
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
        res.render("error/500");
    }
});

router.get("/", ensureAuthentication, async (req, res) => {
    try {
        const stories = await Story.find({ status: "public" })
            .populate("user")
            .sort({ ceatedAt: "desc" })
            .lean();
        res.render("stories/index", {
            stories,
        });
    } catch (e) {
        console.log(error);
        res.render("error/500");
    }
});

router.get("/:id", ensureAuthentication, async (req, res) => {
    try {
        const stories = await Story.find({ _id: req.params.id })
            .populate("user")
            .lean();
        res.render("stories/showStory", {
            stories,
        });
    } catch (error) {
        console.log(error);
        res.render("error/500");
    }
});

router.get("/edit/:id", ensureAuthentication, async (req, res) => {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
        return res.render("error/404");
    }

    if (story.user != req.user.id) {
        return res.redirect("/stories");
    }

    res.render("stories/edit", { story });
});

router.put("/:id", ensureAuthentication, async (req, res) => {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
        res.render("error/404");
    }

    if (story.user != req.user.id) {
        return res.redirect("/stories");
    } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });
    }

    res.redirect("/dashboard");
});

router.delete("/delete/:id", ensureAuthentication, async (req, res) => {
    let story = await Story.findById(req.params.id).lean();
    if (!story) {
        res.render("error/404");
    }

    if (story.user != req.user.id) {
        return res.redirect("/stories");
    } else {
        story = await Story.findOneAndDelete({ _id: req.params.id });
    }

    res.redirect("/dashboard");
    // console.log(req.params);
});

module.exports = router;
