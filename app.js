require("dotenv/config");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoSession = require("connect-mongo")(session);
const methodOverride = require("method-override");

require("./config/passport")(passport);
const {
    formatDate,
    truncate,
    deleteHtmlTags,
    editIcon,
    select,
} = require("./helpers/hbs");

mongoose.connect(
    process.env.DBURI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Database connected")
);

const app = express();

mongoose.set("useFindAndModify", false);
app.set("view engine", ".hbs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
    methodOverride((req, res) => {
        if (req.body && typeof req.body === "object" && "_method" in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
);

app.engine(
    ".hbs",
    exphbs({
        helpers: { formatDate, truncate, deleteHtmlTags, editIcon, select },
        defaultLayout: "main",
        extname: ".hbs",
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoSession({ mongooseConnection: mongoose.connection }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

// set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
}

app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/index"));
app.use("/profile", require("./routes/profile"));
app.use("/stories", require("./routes/stories"));

app.listen(
    process.env.PORT,
    console.log(
        `Server is app and running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
    )
);
