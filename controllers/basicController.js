const Dbo = require("../models/dbo");
const config = require("config");
const path = require("path");

// route without a table
const basic_index = (req, res) => {
	res.render("index", { persons: [], post: "none" });
};

// route to show the table
const basic_create_get = (req, res) => {
	const persons = createPersonObj();
	Dbo.find().then((result) => {
		// define phone number array
		const numbersArr = [];

		// make array of phone numbers
		result.forEach((res) => {
			numbersArr.push(res.telefon);
		});

		// check if user exists in db
		persons.forEach((person) => {
			if (numbersArr.includes(person.phoneNumber)) {
				person.status = "Spremljen";
				person.color = "green";
			} else if (person.err) {
				person.status = "Error";
				person.color = "red";
			} else {
				person.status = "Na čekanju";
				person.color = "orange";
			}
		});

		res.render("index", { persons, post: "" });
	});
};

// post route
const basic_create_post = (req, res) => {
	const persons = createPersonObj();
	persons.forEach((person) => {
		Dbo.exists({ telefon: person.phoneNumber }).then((result) => {
			// save to db if there is no error
			if (!result && !person.err) {
				const dbo = new Dbo({
					ime: person.name,
					prezime: person.lastName,
					postanskiBr: person.postNumber,
					grad: person.city,
					telefon: person.phoneNumber,
				});
				dbo.save()
					.then((result) => {
						console.log("uspješno");
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
	});
	res.redirect("/create");
};

// exporting modules
module.exports = {
	basic_index,
	basic_create_get,
	basic_create_post,
};

// check if string contains only digits
const isNumeric = (n) => {
	return n.match(/^[0-9]+$/) != null;
};

// create Persons array of objects
const createPersonObj = () => {
	let persons = [];
	let numbers = [];

	var csvPath = path.dirname(require.main.filename) + config.get("Paths.data");

	// reading file sync and spliting by new line
	const lines = require("fs").readFileSync(csvPath, "utf-8").split("\n");

	// for each line in a file
	lines.forEach((line) => {
		const data = line.split(";");
		// defining person object
		const person = {};
		const phone = data[4].replace("\r", "");
		// object properties
		person.name = data[0];
		person.lastName = data[1];
		person.postNumber = data[2];
		person.city = data[3];
		person.phoneNumber = phone;

		// checking for error in postNumber
		if (isNumeric(data[2])) {
			person.err = null;
		} else {
			person.err = "error";
		}

		if (!numbers.includes(phone)) {
			// pushing phone number into numbers
			numbers.push(phone);
			// pushing person object to person array
			persons.push(person);
		}
	});

	return persons;
};
