# Protein Ride

Simple toy I made for friend's defence.

<img width=500 src="public/imgs/demo.gif">

## Dependencies
This is essentially an [express](https://expressjs.com/), which uses [ejs](https://ejs.co/) to create html templates. All the 3D rendering is done by [three.js](https://threejs.org/). 

## Installation
No need to install. You can simply use the demo at https://sleepy-reaches-23004.herokuapp.com/protein.

If you want to tinker with it:
- clone this repo as
```bash 
$ git clone https://github.com/axyorah/protein-ride.git
```
- go to the project's root directory and install all the dependencies by running:
``` bash
$ npm install 
```
- install [`http-server`](https://www.npmjs.com/package/http-server):
```bash
$ npm install --global http-server
```
- start the http server: in the project's root directory run:
```bash
$ http-server . -p 8181
```
- in your browser go to `localhost:8181/protein` and have fun!