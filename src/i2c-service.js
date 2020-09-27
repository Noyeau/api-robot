var events = require('events');


const I2C = require('raspi-i2c').I2C;

const i2c = new I2C();


const devices = [
    { code: "motor", chanel: 0x09, onEvent: new events.EventEmitter(), sendData, readData, readyToSend: true, error: null },
    { code: "sensor", chanel: 0x08, onEvent: new events.EventEmitter(), sendData, readData, readyToSend: true, error: null },
]




async function sendData(data, force = false) {
    return new Promise((resolve, reject) => {
        try {
            if (this.readyToSend || force) {
                this.readyToSend = false
                i2c.write(this.chanel, Buffer.from(data), (error) => {
                    setTimeout(() => {
                        this.readyToSend = true
                    }, 100)
                    if (error) {
                        console.log("error sendData i2c-" + this.code, error)
                        this.error = "disconnected";
                        return reject(error);
                    }
                    this.error = null;
                    // console.log("envoiOK-", data)
                    resolve({ status: "ok" })
                })
            } else {
                reject()
            }
        } catch (err) {
            console.error(new Error("sendData"))
            reject(err)
        }

    })
}

async function readData() {
    return new Promise((resolve, reject) => {
        try {
            i2c.read(this.chanel, 150, (error, data) => {
                if (error) {
                    console.log("error", error)
                    reject(error)
                    return error;
                }
                let rep = data.toString('utf8').replace(/�/g, '');
                resolve(rep);
                this.onEvent.emit('data', rep);
            })
        } catch (err) {
            console.error(new Error("readData"))
            reject(err)
        }
     
    })
}




module.exports = devices;
