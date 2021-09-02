# Protein Ride

Simple toy I made for friend's defence.

<img width=500 src="public/imgs/demo.gif">

## Dependencies
This is essentially an [`express`](https://expressjs.com/) app, which uses [`ejs`](https://ejs.co/) to create html templates. All the 3D rendering is done by [`three.js`](https://threejs.org/). 

Turning this into an app is a bit of an overkill - this could've been a simple html page with some accompanying js and css files. Then [`three.js`](https://threejs.org/) would've been the only dependency. But it's easier to host it online this way, so app it is :P

## Installation and Use
No need to install. You can simply check the demo at https://sleepy-reaches-23004.herokuapp.com/protein.

If you want to tinker with it:
- clone this repo as
```bash 
$ git clone https://github.com/axyorah/protein_ride.git
```
- go to the project's root directory and install all the dependencies by running:
``` bash
$ npm install 
```
- start the app by running:
```bash
$ npm start
```
or, if you use [`nodemon`](https://www.npmjs.com/package/nodemon):
```bash
$ nodemon
```
- in your browser go to `localhost:3000/protein` and have fun!