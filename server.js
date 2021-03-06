"use strict";

const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"))

app.listen(process.env.PORT || 1337, () => console.log("Server is running!"))

app.post("/", function (req, res) {
	
	if(req.body.withdrawID != null) {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		let customerBalance = file[parseInt(req.body.withdrawID)]["balance"];
		let difference = customerBalance + Number(req.body.withdrawValue);

		if(req.body.withdrawValue.charAt(0) == "+") {
			file[parseInt(req.body.withdrawID)]["balance"] += Number(req.body.withdrawValue);
		}
		else if(req.body.withdrawValue.charAt(0) == "-" && difference >= 0) {
			file[parseInt(req.body.withdrawID)]["balance"] += Number(req.body.withdrawValue);
		}

		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Balance action made successfully!');
			res.end();
		});
	}
	else if(req.body.deleteID != null) {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		file.splice(parseInt(req.body.deleteID), 1);

		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Deletion made successfully!');
			res.end();
		});
	}
	else if(req.body.reqID == "payMembership") {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		let membership = 40;
		let directDebit = 0.95;
		for(let i = 0; i < file.length; i++) {
			if(file[i].balance >= membership * directDebit) {
				if(file[i].directDebit === true) {
					file[i].balance -= membership * directDebit;
					file[i].membership = true;
				}
				else if(file[i].directDebit === false && file[i].balance >= membership) {
					file[i].balance -= membership;
					file[i].membership = true;
				}
			}
			else {
				file[i].membership = false;
			}
		}

		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Payment taken successfully!');
			res.end();
		});
	}
	else if(req.body.depositID == null) {
		let file = JSON.parse(fs.readFileSync('./public/customers.json').toString());
		let customer = {
			"ID": req.body.fName.substr(0, 3) + req.body.lName.substr(0, 3),
			"fName": req.body.fName,
			"lName": req.body.lName,
			"balance": parseInt(req.body.balance),
			"directDebit": req.body.directDebit ? true : false,
			"membership": req.body.membership ? true : false,
			"5kTime": req.body.fivekTime
		}
		file.push(customer)
		fs.writeFile('./public/customers.json', JSON.stringify(file, null, 2), function(err) {
			if (err) throw err;
			console.log('Customer added successfully!');
			res.end();
		});
	}
});