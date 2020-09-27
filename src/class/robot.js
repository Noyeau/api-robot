
const aiMotors = require('../ai-motors');
var i2cDevices = require('../i2c-service');
const gps = require('../gps.service');

let motorDevice = i2cDevices.find(x => x.code == "motor");
let sensorDevice = i2cDevices.find(x => x.code == "sensor");

const envAnalyser = require('../myRobot/envAnalyser')


class Robot {
    constructor(options) {
        if (options) {
            Object.assign(this, options)
        }
    }
    cameras = null
    actions = {}
    motorDevice = motorDevice
    sensorDevice = sensorDevice
    envAnalyser=envAnalyser

    status = {
        gps : gps,
        motors: "stop",
        obstacle:{},
        sensors: { radar: {}, ir: {}, obstacle: null, meteo: {} },
        piloteAuto:{
            FL: 0,
            FR: 0,
            RR: 0,
            RL: 0,
        }
    }
   params={}
    io = null
    aiMotors = aiMotors
}


module.exports = Robot


