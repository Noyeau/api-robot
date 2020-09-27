var brain = require('brain.js');
var netGoTo = new brain.NeuralNetwork();
var netRotate = new brain.NeuralNetwork();
const dataTraining = require('./data-training');

var i2cDevices = require('../i2c-service');


const motorDevice = i2cDevices.find(x => x.code == "motor")
console.log(i2cDevices)
trainingGoTo();
trainingRotate();

module.exports = {
    goTo,
    rotate,
    stop,
    convertCoordGoTo,
    convertCoordRotate,
    prepareToSend
}

// exports.goTo = goTo;
// exports.rotate = rotate;
// exports.stop = stop;

/**
 * Arreter le robot
 */
function stop() {
    if (motorDevice.readyToSend) {
        if (myRobot.status.motors !== "stop") {
            console.log("stop");
            myRobot.status.motors = "stop";
            let data = { FR: 0, FL: 0, RR: 0, RL: 0 }
            motorDevice.sendData(prepareToSend(data));
            return data;
        }
    }

}


function convertCoordGoTo(x, y){
    x = Math.round(x*100)/100
    y = Math.round(y*100)/100
    var output = netGoTo.run({ x: x, y: y });
    return formateData(output)
}

function convertCoordRotate(x, y, z){
    x = Math.round(x*100)/100
    y = Math.round(y*100)/100
    z = Math.round(z*100)/100
    var output = netRotate.run({ x: x, y: y, z: z });
    console.log(formateData(output))
    return formateData(output)
}


/**
 * Déplacer le robot en restant sur le meme axe
 * @param {number} x position sur l'axe x. -1 gauche, 1 droite
 * @param {number} y position sur l'axe y. -1 bas, 1 haut
 */
function goTo(x = 0, y = 0) {
    if (motorDevice.readyToSend) {
        x = Math.round(x*100)/100
        y = Math.round(y*100)/100

        if (myRobot.status.motors !== "goTo-X" + x + "Y" + y) {
            var output = netGoTo.run({ x: x, y: y });
            console.log("GoTo x:" + x + " y:" + y, output);
            myRobot.status.motors = "goTo-X" + x + "Y" + y;
            if (myRobot.status.motors == "goTo-X0Y0") {
                stop()
            }
            let data = formateData(output)
            motorDevice.sendData(prepareToSend(data));
            return data;
        }
    }
}

/**
 * Faire tourner le robot
 * @param {number} x position du centre de rotation sur l'axe x. -1 gauche, 1 droite
 * @param {number} y position du centre de rotation sur l'axe y. -1 bas, 1 haut
 * @param {number} z vitesse et sens de rotation. -1 antiHoraire, 1 horaire, 0 arret
 */
function rotate(x = 0, y = 0, z = 0) {
    if (motorDevice.readyToSend) {
        x = Math.round(x*100)/100
        y = Math.round(y*100)/100
        z = Math.round(z*100)/100

        if (myRobot.status.motors !== "rotate-X" + x + "Y" + y + "Z" + z) {
            var output = netRotate.run({ x: x, y: y, z: z });
            console.log("Rotate x:" + x + " y:" + y + " z:" + z, output);
            myRobot.status.motors = "rotate-X" + x + "Y" + y + "Z" + z;
            let data = formateData(output)
            motorDevice.sendData(prepareToSend(data));
            return data;
        }
    }
}


function trainingGoTo() {
    console.log('----****----**** AiMotors - netGoTo -> Start Training ****----****----')
    netGoTo.train(dataTraining.dataGoTo, {
        log: (info) => console.log(info)
    });
    console.log('----****----**** AiMotors - netGoTo -> End Training ****----****----')
}

function trainingRotate() {
    console.log('----****----**** AiMotors - netRotate -> Start Training ****----****----')
    netRotate.train(dataTraining.dataRotate, {
        log: (info) => console.log(info)
    });
    console.log('----****----**** AiMotors - netRotate -> End Training ****----****----')

}

function formateData(data) {
    let dataFormate = {
        FL: Math.round((data.FLf.toFixed(2) - data.FLb.toFixed(2)).numMap(-1, 1, -255, 255)),
        FR: Math.round((data.FRf.toFixed(2) - data.FRb.toFixed(2)).numMap(-1, 1, -255, 255)),
        RL: Math.round((data.RLf.toFixed(2) - data.RLb.toFixed(2)).numMap(-1, 1, -255, 255)),
        RR: Math.round((data.RRf.toFixed(2) - data.RRb.toFixed(2)).numMap(-1, 1, -255, 255))
    }
    return dataFormate;
}


function prepareToSend(data) {
    let rep = "";
    for (let x in data) {
        // rep += x + ":" + data[x]+"|";
        rep += data[x]+"|";

    }
    // console.log(rep.slice(0, -1))
    return rep.slice(0, -1);
}
