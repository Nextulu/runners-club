"use strict";

let username = document.getElementById("name");
let password = document.getElementById("pass");
let loginStatus = document.getElementsByClassName("loginStatus")[0];

let customers;

function makeRequest(file){
	let requestFile = file;
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			if(file == "customers.json") {
				customers = JSON.parse(this.responseText);
				showCustomers();
			}
			else {
				document.getElementById("panel").innerHTML = this.responseText;
			}
		}
	}
	request.open('GET', requestFile, true);
	request.send();
}

function account(name, pass) {
    this.name = name;
    this.pass = pass;
}

let admin = new account("admin","123");

function loginEnter() {
	loginStatus.classList.add("fadeIn");
	loginStatus.style.display = "flex";
	loginStatus.addEventListener("animationstart", function() {
		document.getElementById("login").removeChild(document.getElementById("login").lastChild);
	});
	setTimeout(function(){ 
		loginStatus.style.backgroundColor = "#7AC142";
		document.getElementById("login").style.borderTopColor = "#7AC142";
		document.getElementsByClassName("loader")[0].style.animation = "none";
		document.getElementsByClassName("loader")[0].style.borderColor = "#5F9934";
		document.getElementsByClassName("loader")[0].style.backgroundColor = "#5F9934";
		document.getElementsByClassName("loader")[0].innerHTML = "&#10003;";
		loginStatus.lastElementChild.innerHTML = "Welcome back";
		setTimeout(function(){ 
			document.getElementById("login").classList.add("fadeOutUp");
			document.getElementById("login").addEventListener("animationend", function() {
				document.getElementById("login").parentNode.removeChild(document.getElementById("login"));
				document.getElementById("panel").style.display = "flex";
			});
		 }, 1000);
	}, 1500);	
}

function login() {
    if(username.value == admin.name && password.value == admin.pass) {
		makeRequest("admin.txt");
		loginEnter();
    }
    else {
        alert("wrong data!");
	}
}

//makeRequest("admin.txt");
makeRequest("customers.json");

function showCustomers() {
	for(let i = 0; i < customers.length; i++) {
		let customer = document.createElement("div");
		let fName = document.createElement("p");
		let lName = document.createElement("p");
		let balance = document.createElement("p")
		fName.innerHTML = customers[i].fName;
		fName.className = "name";
		lName.innerHTML = customers[i].lName;
		lName.className = "name";
		balance.innerHTML = customers[i].balance;
		balance.className = "balance";
		customer.appendChild(fName);
		customer.appendChild(lName);
		customer.appendChild(balance);
		customer.className = "customer";
		document.getElementById("content").appendChild(customer);
	}
}



function balanceChange() {
	let modal = document.getElementsByClassName("modal")[0];
	let span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	span.addEventListener('click', function() {
    	modal.style.display = "none";
	});
	window.addEventListener('click', function(event) {
    	if (event.target == modal) {
        	modal.style.display = "none";
    	}
	});
}

let addCust = document.getElementById("addCust");
addCust.addEventListener("click", addCustomer);

function addCustomer() {
	let modal = document.getElementsByClassName("modal")[0];
	let span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	span.addEventListener('click', function() {
		modal.style.display = "none";
		document.getElementById("addCustomer").style.display = "none";
	});
	window.addEventListener('click', function(event) {
    	if (event.target == modal) {
			modal.style.display = "none";
			document.getElementById("addCustomer").style.display = "none";
    	}
	});
	document.getElementById("addCustomer").style.display = "block";
}

document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'balance' ) ) {
        balanceChange();
    }
}, false);

let btnAddCust = document.getElementById("pushCustomer");
btnAddCust.addEventListener("click", pushCustomer);

let cust = {};
function pushCustomer() {
	cust.ID = addFName.value.substring(0, 3) + addLName.value.substring(0, 3);
	cust.fName = addFName.value;
	cust.lName = addLName.value;
	cust.balance = parseInt(addBalance.value);
	if(addDDebit.checked) {
		cust.directDebit = true;
	} else {
		cust.directDebit = false;
	}
	if(addMembership.checked) {
		cust.membership = true;
	} else {
		cust.membership = false;
	}
	
	customers.push(cust);
	let customersJSON = JSON.stringify(customers);
	createCookie("customersList", customersJSON, 365);
	
	
	console.log(document.cookie);
	console.log(customers);
}

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
		console.log(expires);
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

getCookie("customersList");