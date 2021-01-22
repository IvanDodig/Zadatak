const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

// importing routes
const basicRoutes = require("./routes/basicRoutes");

// express app
const app = express();

// config vars
const host = config.get("App.web-server.host");
const PORT = config.get("App.web-server.port");
const dbURI = config.get("DB.connString");
mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => app.listen(PORT))
	.catch((err) => console.log(`DB error occured: ${err}`));

// register view engine
app.set("view engine", "ejs");

// middleware and static files
app.use(express.static("public"));

// ROUTES
// basic routes
app.use(basicRoutes);

// 404 page
app.use((req, res) => {
	res.status(404).render("404");
});
