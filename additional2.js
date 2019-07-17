"use strict"; 
var numBooks = 0;

// Load books
function loadBooks() {  	
	$.getJSON('books.json', function(data) {
	  var bookRow = $('#bookRow');
	  var bookTemplate = $('#bookTemplate');

	  for (var i = 0; i < data.length; i ++) {
		bookTemplate.find('.name').text(data[i].name);
		bookTemplate.find('img').attr('src', data[i].picture);
		bookTemplate.find('.author').text(data[i].author);
		bookTemplate.find('.published').text(data[i].published);
		bookTemplate.find('.checkout').attr('data-id', data[i].id);
		bookTemplate.find('.return').attr('data-id', data[i].id);
		bookRow.append(bookTemplate.html());
	  }
	  numBooks = data.length;
	}); 
}
loadBooks();

// Contract Info
const contract_address = "0xe498a782bc9a2dc087611f1e32a78b0f93d4d6fb";  
const abi = [
	{
		"constant": true,
		"inputs": [],
		"name": "getUsers",
		"outputs": [
			{
				"name": "",
				"type": "address[1000]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "bookId",
				"type": "uint256"
			}
		],
		"name": "checkOut",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "users",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBookCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "bookId",
				"type": "uint256"
			}
		],
		"name": "checkIn",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];



// Info to find contract and its ABI
var contract = web3.eth.contract(abi).at(contract_address);
// object to hold addresses
var users = {1:"0x0000000000000000000000000000000000000000", 2:"0x0000000000000000000000000000000000000000"};

// Set web3 provider
if (typeof web3 !== 'undefined')
{
  web3 = new Web3(web3.currentProvider);
} 
else 
{
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}
var account = 0;
// Get an account address
web3.eth.getAccounts((err, res) => { 
	if (typeof res[0] === 'undefined') {
		document.getElementById('message').innerHTML = 'You need to login to metamask';
	}else{        
		account = res[0];
	} 
});


// View your book list
function viewList() {	
	// Get the list of users from the contract
	contract.getUsers.call((error, result) => {
	  if(error) {
		  return console.log(error);
	  }
	  users = result;		 	
	  // List the books that have been checked out 
	  var checked = 1;
	  for (var m=0; m < numBooks; m++) {	
		if (users[m] == account) {				
			var bookName = $('h3').eq(m).html();
			document.getElementById('mybook' + checked).innerHTML = "<li> &nbsp;" + bookName;
			console.log(bookName);
			checked = checked + 1;
		}		
	  }
	});	
	contract.getBookCount({from: account}, function(error, result) {
	  if(error) {
		  return console.log(error);
	  }
	  var userBooks = result;	
	  document.getElementById('bookcount').innerHTML = "Total: " + userBooks;
	});
	document.getElementById('booklistpop').style.display = "block";
}

/* close the popup box */
function closePop() {
	document.getElementById('booklistpop').style.display = "none";
}



// On page load
window.addEventListener('load', () => {	
	// Check for Metamask
	if(typeof(web3) === 'undefined') {
	  document.getElementById('message').innerHTML = 'Error: You need to install Metamask.';
	  return console.log("Metamask is not installed");
	}   

	// Get the users and mark books that are checked out
	function getUsers() {
		// Get the list of users from the contract
		contract.getUsers.call((error, result) => {
		  if(error) {
			  return console.log(error);
		  }
		  users = result;		 	
		  // Mark the books that have been checked out  
		  for (var j=0; j < numBooks; j++) {		
			if (users[j] == account) {		
				$('.checkout').eq(j).hide(); 		
				$('.return').eq(j).show(); 
			}
			else if (users[j] !== '0x0000000000000000000000000000000000000000') {
				$('.checkout').eq(j).html("Not Available");
				$('.checkout').eq(j).prop("disabled", true);	  
			}		
		  }
		});	
	}  
	getUsers(); 


	/*  Trying a new method 
	  // Check for Metamask
	  if(typeof(web3) === 'undefined') {
		  document.getElementById('message').innerHTML = 'Error: You need to install Metamask.';
		  console.log("Metamask is not installed");
	  }   

	// Replace Check for Metamask above with this section and test// On page load
	window.addEventListener('load', () => {	

		 if (window.ethereum) {
			window.web3 = new Web3(ethereum);
			try {
				// Request account access if needed
				await ethereum.enable();
				);
			} catch (error) {
				// User denied account access...
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			window.web3 = new Web3(web3.currentProvider);
		   );
		}
		// Non-dapp browsers...
		else {
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
	}
	  
	  // Get the users and mark books that are checked out
	  function getUsers() {
		// Get the list of users from the contract
		contract.getUsers.call((error, result) => {
		  if(error) {
			  return console.log(error);
		  }
		  users = result;		 	
		  // Mark the book that have been checked out  (only using first five instead of users.length)
		  for (i=0; i < 5; i++) {		
			if (users[i] !== '0x0000000000000000000000000000000000000000') {
				document.getElementById(i).innerHTML = "Not Available"
				document.getElementById(i).disabled = true;	  
			}
			if (users[i] == account) {				
			  document.getElementById("ret" + i).style.display = "block";
			}
		  }		  
		});	
	  }  
	  getUsers(); 	  
	  
	}); 
	*/

	 
	// Listens for click of Checkout buttons
	$(document).on('click', '.checkout', function(event){
		event.preventDefault();
		var bookId = parseInt($(event.target).data('id'));
		checkOut(bookId);
	});  

	// Check out a book
	function checkOut(bookId) { 
		// Check number of books user has checked out
		var booksOut = 0;
		contract.getBookCount({from: account}, function(error, result) {
			if(error) {
			  return console.log(error);
			}
			booksOut = result;			
		  	  		
			// Only allow user to check out a book if they have less than 3 checked out
			if (booksOut < 3) {
				var bookName = $('h3').eq(bookId).html();
				console.log("checking out: " + bookName);

				contract.checkOut(bookId, {from: account}, function(error, result){
					if(error)		   
					   console.error(error);
				});				
				document.getElementById('message').innerHTML = bookName + " is being checked out. Please wait...";
				
				var myResult = 0x0000000000000000000000000000000000000000;
				// Wait for Metamask and block validation
				var update = setInterval(function(){
					console.log('working...');
					contract.getUsers.call((error, result) => {
					  if(error) {
						  clearInterval(update);
						  return console.log(error);			  
					  }		
					  myResult = result[bookId];		  
					});	
					
					if (myResult === account) {
					  location.reload();
					  clearInterval(update);				 		
					}		
				}, 2000);
			} else {
				document.getElementById('alert').innerHTML = "You can only have 3 books checked out at a time."
				document.getElementById('messagepop').style.display = "block";
				var hidemessage = setInterval(function(){
					document.getElementById('messagepop').style.display = "none";
					clearInterval(hidemessage);
				}, 4000);
			}
		});
	};  
	  
	  
	 // Listens for click of Return buttons
	 $(document).on('click', '.return', function(event){
		event.preventDefault();
		var bookId = parseInt($(event.target).data('id'));
		checkIn(bookId);
	});

	// Return a book
	function checkIn(bookId) {
		var bookName = $('h3').eq(bookId).html();
		console.log("returning: " + bookName);
		
		contract.checkIn(bookId, {from: account}, function(error, result){
			if(error)		   
			   console.error(error);
		});			
		document.getElementById('message').innerHTML = bookName + " is being returned. Please wait...";
		
		var myResult = account;
		var update = setInterval(function(){
			console.log('working...');
			contract.getUsers.call((error, result) => {
			  if(error) {
				  clearInterval(update);
				  return console.log(error);			  
			  }		
			  myResult = result[bookId];			  
			});	
			
			if (myResult === '0x0000000000000000000000000000000000000000') {
			  location.reload();
			  clearInterval(update);				 		
			}		
		}, 2000);			
	};
}); 

	


