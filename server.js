"use strict";

const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")

app.use(express.static("public"))
app.listen(process.env.PORT || 1337, () => console.log("Server is running!"))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.post("/", function (req, res) {
	let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
	let customer = {
		"ID": req.body.fName.substr(0, 3) + req.body.lName.substr(0, 3),
		"fName": req.body.fName,
		"lName": req.body.lName,
		"balance": req.body.balance,
		"directDebit": req.body.directDebit ? true : false,
		"membership": req.body.membership ? true : false
	}
	file.push(customer)
	fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
		if (err) throw err;
		console.log('Data written successfully!');
		res.end();
	});
});
