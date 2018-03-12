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

let customersList = document.getElementById("customersList");

function showCustomers() {
	while (customersList.firstChild) {
		customersList.removeChild(customersList.firstChild);
	}
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
		balance.id = i;

		let btnDelete = document.createElement("input");
		btnDelete.type = "button";
		btnDelete.value = "Delete";
		btnDelete.className = "btnDelete";
		btnDelete.id = i;
		
		customer.appendChild(btnDelete);
		customer.appendChild(fName);
		customer.appendChild(lName);
		customer.appendChild(balance);
		customer.className = "customer";
		customersList.appendChild(customer);
	}
}

function balanceChange() {
	let modal = document.getElementsByClassName("modal")[0];
	let span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	formChangeBalance.style.display = "block";
	span.addEventListener('click', function() {
		modal.style.display = "none";
		formChangeBalance.style.display = "none";
	});
	window.addEventListener('click', function(event) {
    	if (event.target == modal) {
			modal.style.display = "none";
			formChangeBalance.style.display = "none";
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
    if (event.target.classList.contains('balance')) {
		balanceChange();
		document.getElementById("depositID").value = event.target.id;
		document.getElementById("withdrawID").value = event.target.id;
	}
	else if (event.target.classList.contains('btnDelete')) {
		confirmDelete();
		document.getElementById("deleteID").value = event.target.id;
	}
}, false);

let formDeleteCustomer = document.getElementById("formDeleteCustomer");


function confirmDelete() {
	let modal = document.getElementsByClassName("modal")[0];
	let span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	formDeleteCustomer.style.display = "block";
	span.addEventListener('click', function() {
		modal.style.display = "none";
		formDeleteCustomer.style.display = "none";
	});
	window.addEventListener('click', function(event) {
    	if (event.target == modal) {
			modal.style.display = "none";
			formDeleteCustomer.style.display = "none";
    	}
	});
}

