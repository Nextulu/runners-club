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
		customer.className = "customer";
		
		let name = document.createElement("span");
		name.innerHTML = customers[i].fName + " " + customers[i].lName;
		name.className = "customerName";
		customer.appendChild(name);

		let btnBalance = document.createElement("input");
		btnBalance.type = "button";
		btnBalance.value = "Balance";
		btnBalance.className = "balance";
		btnBalance.id = i;
	
		let first = document.createElement("p");
		first.innerHTML = "id: ";
		first.className = "customerInfo";
		customer.appendChild(first);

		let id = document.createElement("span");
		id.innerHTML = customers[i].ID;
		id.className = "customerData";
		first.appendChild(id);

		let second = document.createElement("p");
		second.innerHTML = "balance: ";
		second.className = "customerInfo";
		customer.appendChild(second);

		let balance = document.createElement("span");
		balance.innerHTML = "&pound;" + customers[i].balance;
		balance.className = "customerData";
		second.appendChild(balance);

		let third = document.createElement("p");
		third.innerHTML = "best time: ";
		third.className = "customerInfo";
		customer.appendChild(third);

		let time = document.createElement("span");
		time.innerHTML = customers[i]["5kTime"];
		time.className = "customerData";
		third.appendChild(time);

		let fourth = document.createElement("p");
		fourth.innerHTML = "membership: ";
		fourth.className = "customerInfo";
		customer.appendChild(fourth);

		let membership = document.createElement("span");
		membership.innerHTML = customers[i].membership ? "Active" : "Inactive";
		if(membership.innerHTML == "Active") {membership.style.color = "#40A832";}
		else {membership.style.color = "#E84545";}
		membership.className = "customerData";
		fourth.appendChild(membership);

		let bottomBar = document.createElement("div");
		bottomBar.className = "customerPanel";
		bottomBar.appendChild(btnBalance);
		customer.appendChild(bottomBar);

		let btnDelete = document.createElement("input");
		btnDelete.type = "button";
		btnDelete.value = "Delete";
		btnDelete.className = "btnDelete";
		btnDelete.id = i;
		bottomBar.appendChild(btnDelete);
		
		customersList.appendChild(customer);
	}
}

function balanceChange() {
	document.getElementById("formAddCustomer").style.display = "none";
	document.getElementById("formWithdraw").style.display = "block";
	document.getElementById("formDeleteCustomer").style.display = "none";

	document.getElementsByClassName("formTitle")[0].innerHTML = "Balance actions";

	let modal = document.getElementsByClassName("modal")[0];
	let span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";
	
	span.addEventListener('click', function() {
		modal.style.display = "none";
		document.getElementById("formWithdraw").style.display = "none";
		document.getElementById("formWithdraw").reset();
		document.getElementById("changeWithdraw").className = "";
	});
	window.addEventListener('click', function(event) {
    	if (event.target == modal) {
			modal.style.display = "none";
			document.getElementById("formWithdraw").style.display = "none";
			document.getElementById("formWithdraw").reset();
			document.getElementById("changeWithdraw").className = "";
    	}
	});
}

let addCust = document.getElementById("addCust");
addCust.addEventListener("click", addCustomer);

let fName = document.getElementById("addFName");
let lName = document.getElementById("addLName");
let balance = document.getElementById("addBalance");
let fiveKTime = document.getElementById("add5kTime");

function addCustomer() {
	document.getElementById("formAddCustomer").style.display = "block";
	document.getElementById("formWithdraw").style.display = "none";
	document.getElementById("formDeleteCustomer").style.display = "none";

	document.getElementsByClassName("formTitle")[0].innerHTML = "Customer creation";
	
	let modal = document.getElementsByClassName("modal")[0];
	let span = document.getElementsByClassName("close")[0];
	modal.style.display = "block";

	span.addEventListener('click', function() {
		modal.style.display = "none";
		document.getElementById("formAddCustomer").style.display = "none";
		document.getElementById("formAddCustomer").reset();

		fName.className = "";
		lName.className = "";
		balance.className = "";
		fiveKTime.className = "";

	});

	window.addEventListener('click', function(event) {
    	if (event.target == modal) {
			modal.style.display = "none";
			document.getElementById("formAddCustomer").style.display = "none";
			document.getElementById("formAddCustomer").reset();

			fName.className = "";
			lName.className = "";
			balance.className = "";
			fiveKTime.className = "";
    	}
	});
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('balance')) {
		balanceChange();
		document.getElementById("withdrawID").value = event.target.id;
	}
	else if (event.target.classList.contains('btnDelete')) {
		confirmDelete();
		document.getElementById("deleteID").value = event.target.id;
	}
}, false);

let formDeleteCustomer = document.getElementById("formDeleteCustomer");


function confirmDelete() {
	let confirmModal = document.getElementsByClassName("confirmModal")[0];
	let close = document.getElementById("closeModal");

	confirmModal.style.display = "block";
	formDeleteCustomer.style.display = "block";
	close.addEventListener('click', function() {
		confirmModal.style.display = "none";
		formDeleteCustomer.style.display = "none";
	});
	window.addEventListener('click', function(event) {
    	if (event.target == confirmModal) {
			confirmModal.style.display = "none";
			formDeleteCustomer.style.display = "none";
    	}
	});
}

document.getElementById("btnDelete").addEventListener("click", function() {
	document.getElementsByClassName("confirmModal")[0].style.display = "none";
	document.getElementById("formDeleteCustomer").style.display = "none";
});


let validationData = {
	"fName": false,
	"lName": false,
	"balance": false,
	"fiveKTime": false
}

if(isCustomerValid(validationData)) {
	document.getElementsByClassName("modal")[0].style.display = "none";
	document.getElementById("formAddCustomer").style.display = "none";
}



function isCustomerValid(obj) {
	if(obj.fName == true && obj.lName == true && obj.balance == true && obj.fiveKTime == true) {
		return true;
	}
	return false;
}

function validate(element, regexp, name) {
	if(regexp.exec(element.value) !== null) {
		validationData[name] = true;
		element.className = "correct";
	}
	else {
		validationData[name] = false;
		element.className = "invalid";
	}
}
	
fName.addEventListener("input", () => validate(fName, /^[A-Za-z\s]{3,}$/, "fName"));
lName.addEventListener("input", () => validate(lName, /^[A-Za-z]{3,}$/, "lName"));
balance.addEventListener("input", () => validate(balance, /^[0-9]+$/, "balance"));
fiveKTime.addEventListener("input", () => validate(fiveKTime, /^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/, "fiveKTime"));


let changeWithdraw = document.getElementById("changeWithdraw");

changeWithdraw.addEventListener("input", function() {
	if(/^(\+|\-)[0-9]+$/.exec(this.value) !== null) {
		this.className = "correct";
	}
	else {
		this.className = "invalid";
	}	
});

let y = 30;

function notify() {
  let box = document.createElement("div");
  box.opacity = 1;
  let p = document.createElement("p");
  p.innerHTML = "&#9989; Transaction Successful";
  box.appendChild(p);
	box.className = "notification";
  box.style.bottom = y + "px";
  document.body.appendChild(box);
  y += 60;
  console.log(y);
  
  function fadeOut(el){
    el.style.opacity = 1;
    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
  
  setTimeout(function(){ 
    fadeOut(box);
    let toasts = document.querySelectorAll(".notification");
      for(let i = 0; i < toasts.length; i++) {
        toasts[i].style.bottom = parseInt(toasts[i].style.bottom, 10) - 60 + "px"
      } 
      y -= 60;
  }, 2000);
};
