
const onSensorUpdate = require('./onSensorUpdate')





/**
 * Synchronisation des status du Robot en fonction des elements i2c
 */
module.exports = function initSensorUpdate(cadence = 10) {

    setInterval(() => {

        /**
         * SensorDevice1
         */
        myRobot.sensorDevice.readData().then(data => {
            let ir = {};
            let radar = {}
            let meteo = {}
            data = data.split("|");
            data.map((dt, i) => {
                if (dt.toLowerCase().includes("init")) {
                    return
                }

                switch (i) {
                    case 0:
                        radar[dt.split(":")[0]] = +dt.split(":")[1];
                        break;
                    // case 1:
                    //     ir.top = +dt;
                    //     break;
                    // case 2:
                    //     ir.topRight = +dt;
                    //     break;
                    // case 3:
                    //     ir.right = +dt;
                    //     break;
                    // case 4:
                    //     ir.bottomRight = +dt;
                    //     break;
                    // case 5:
                    //     ir.bottom = +dt;
                    //     break;
                    // case 6:
                    //     ir.bottomLeft = +dt;
                    //     break;
                    // case 7:
                    //     ir.left = +dt;
                    //     break;
                    // case 8:
                    //     ir.topLeft = +dt;
                    //     break;
                    case 1:
                        meteo.temp = +dt;
                        break;
                    case 2:
                        meteo.hum = +dt;
                        break;
                }



            })
            Object.assign(myRobot.status.sensors.radar, radar);
            Object.assign(myRobot.status.sensors.ir, ir);
            Object.assign(myRobot.status.sensors.meteo, meteo);

            onSensorUpdate();
        },err=>{
            console.error(new Error("pb read Sensors"))

        })
    }, 1000 / cadence)
}