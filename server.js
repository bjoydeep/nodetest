'use strict';

const express = require('express');
const app = express();


const PORT = 8080;
var counter =1 ;


//generate time since epoch
var tepoch = Math.floor(new Date() / 1000);

//generate random number
var rnum =Math.random();



//needed to generate a random number between 2 integers
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//an initial seed value of the delay
var delaySig = getRandomInt(1, 50);

var gaussian = require('gaussian');
var distribution = gaussian(10, 64);


app.get("/", function (request, response) {
	var hit = counter++;
	//if (hit==delaySig)
	if (Math.abs(hit-delaySig) <=6)
		{
		// Take a random sample using inverse transform sampling method.
        sample = distribution.ppf(Math.random());
		//cause a page render delay every so often
		setTimeout(function(){
    		response.setHeader('Content-Type', 'application/json');
    		// the null,3 prettifies the returned json. No clue why 3 is needed
    		// the new line makes sure that if you run curl, it gives you the command prompt in the next line
    		response.send(JSON.stringify({ "message": "Dude, this is awesome!" , "cdate": tepoch, "responseTime":rnum, "warning":"This is dummy data though:( "}, null, 3)+ '\n');
    		}, sample * 1000);
	}
	else {

			response.setHeader('Content-Type', 'application/json');
			// the null,3 prettifies the returned json. No clue why 3 is needed
			// the new line makes sure that if you run curl, it gives you the command prompt in the next line
			response.send(JSON.stringify({ "message": "Dude, this is awesome!" , "cdate": tepoch, "responseTime":rnum, "warning":"This is dummy data though:( "}, null, 3)+ '\n');
		}
	//every nth hit the counter is reset
	//and another random delay signal generator
	if (hit ==50) {
		counter=1;
		delaySig = getRandomInt(1, 50);
	}


});


app.get("/one", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Pink Flyod: The Wall" }, null, 3)+ '\n');
});

app.get("/two", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Queen: A Night at the Opera" }, null, 3)+ '\n');
});

app.get("/three", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Beatles: Sgt. Papper's Lonely Heart Club Band" }, null, 3)+ '\n');
});

app.get("/four", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Doors: The Doors" }, null, 3)+ '\n');
});

app.get("/five", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Beatles: Revolver" }, null, 3)+ '\n');
});

app.get("/six", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Doors: The Doors" }, null, 3)+ '\n');
});

app.get("/seven", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Doors: The Doors" }, null, 3)+ '\n');
});

app.get("/eight", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Doors: The Doors" }, null, 3)+ '\n');
});

app.get("/nine", function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Doors: The Doors" }, null, 3)+ '\n');
});

app.get("/ten", function (request, response) {

    response.setHeader('Content-Type', 'application/json');
    // the null,3 prettifies the returned json. No clue why 3 is needed
    // the new line makes sure that if you run curl, it gives you the command prompt in the next line
    response.send(JSON.stringify({ "Album": "Doors: The Doors" }, null, 3)+ '\n');

});


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
