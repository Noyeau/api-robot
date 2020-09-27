const path = require('path');
var i2cDevices = require('../i2c-service');
const sensorDevice = i2cDevices.find(x => x.code == "sensor")

const express = require('express');

const app = express();

const server = require('http').Server(app)
const io = require('socket.io')(server)

const { frameToBase64, resizeFrame } = require('../opencv/utils')


module.exports = () => {


    app.use(express.static(path.join(__dirname, 'public')));

    myRobot.io = io;

    io.on('connection', (socket) => {
        //Configuration des parametres de l'user
        socket['userConfig'] = {
            OSD: true,
            frameRate: 10,
            frameWidth: 400,
            _timeOutFrameRate: null,
            statusRate: 4,
            _timeOutStatusRate: null,
            videoFrame: []
        }
        // setInterval(()=>{
        //     socket.emit('myRobot', myRobot.cameras);
        // },1000)



        /**
         * Fonctionnalité du socket par default
         */
        sendCameras(socket)
        sendStatus(socket)




        /**
         * Desactiver les interval et autre type lors d'une déconexion
         */
        socket.on('disconnect', (obj) => {
            if (socket['userConfig']._timeOutFrameRate) {
                clearTimeout(socket['userConfig']._timeOutFrameRate)
            }
        });


        socket.on('action', (obj) => {
            console.log(obj)
            switch (obj.code) {
                // case "check":
                //     myRobot.sensorDevice.sendData("check")
                //     break;

                // case "envAnalyser":
                //     if (obj.code) {
                //         try {
                //             myRobot.envAnalyser[obj.function]()
                //         } catch (err) {
                //             console.error(new Error('envAnalyser - ' + obj.function + ': Fonction Introuvable'))
                //         }
                //     }

                //     break;

                default:
                    if(obj.code && myRobot.actions[obj.code]){
                        if(obj.data){
                           return myRobot.actions[obj.code](obj.data)
                        } else {
                            return myRobot.actions[obj.code]()
                        }
                    }
                    console.log("socketIo on 'action' -> erreur 'code'")
            }
        });

        socket.on('envAnalyser', (obj) => {
            console.log(obj)

            if(obj.code && myRobot.envAnalyser[obj.code]){
                if(obj.data){
                   return myRobot.envAnalyser[obj.code](obj.data)
                } else {
                    return myRobot.envAnalyser[obj.code]()
                }
            }
            console.log("socketIo on 'envAnalyser' -> erreur 'code'")

        });




        /**
         * Configuration des fonctionnalités envoyé par le socket
         */
        socket.on('config', (obj) => {
            console.log(obj)
            switch (obj.type) {
                case "socket":
                    console.log("ConfigSocket")
                    if (!obj.data) {
                        return
                    }
                    Object.assign(socket['userConfig'], obj.data)
                    console.log(socket['userConfig'])
                    break;
                    
            }
        });

        socket.on('test', (obj) => {
            console.log(obj)
            myRobot.status.piloteAuto = {
                FL: obj,
                FR: obj,
                RR: obj,
                RL: obj,
            }
        });

    })


    app.get('/check', function (req, res, next) {
        res.status(200).send({ msg: "demande envoyé" })
        sensorDevice.sendData("check")
    });


    // app.get('/goto', function (req, res, next) {
    //     const x = req.query.x || 0;
    //     const y = req.query.y || 0;
    //     res.status(200).send(aiMotors.goTo(x, y));

    // });

    // app.get('/rotate', function (req, res, next) {
    //     const x = req.query.x || 0;
    //     const y = req.query.y || 0;
    //     const z = req.query.z || 0;
    //     res.status(200).send(aiMotors.rotate(x, y, z));

    // });





    server.listen(3000, function () {
        console.log('%s listening port 3000', app.name);
    });
}



/**
* On envoie les data aux client via SocketIo
* TODO: Deplacer ça dans l'API
*/
async function sendStatus(socket) {
    if (socket['userConfig']._timeOutStatusRate) {
        clearTimeout(socket['userConfig']._timeOutStatusRate);
    }
    let statusRate = socket['userConfig'].statusRate

    socket.emit("status", myRobot.status);
    socket['userConfig']._timeOutStatusRate = setTimeout(() => {
        sendStatus(socket)
    }, 1000 / statusRate)
}

async function sendCameras(socket) {
    let activeStream = true
    /**
     * si on passe le frame rate à 0, on desactive la diffusion
     */
    if (!socket['userConfig'].frameRate || socket['userConfig'].frameRate < 1) {
        socket['userConfig'].frameRate = 0
        activeStream = false
    }

    let frameRate = socket['userConfig'].frameRate

    if (socket['userConfig']._timeOutFrameRate) {
        clearTimeout(socket['userConfig']._timeOutFrameRate);
    }

    if (activeStream) {
        let videosToStream = []
        Promise.all(socket['userConfig'].videoFrame.map(ele => {
            return new Promise(async (resolve) => {
                let elem = ele.split(':')
                switch (elem[0]) {
                    case 'camera': 
                        let camera = myRobot.cameras.find(cam => cam.code == elem[1])
                        let frame;
                        if (socket['userConfig'].OSD) {
                            frame = resizeFrame(camera.onScreenDisplay(), socket['userConfig'].frameWidth)
                        } else {
                            frame = resizeFrame(camera.frame, socket['userConfig'].frameWidth)
                        }

                        const image = frameToBase64(frame)
                        videosToStream.push({ image: image, source: ele, infos: camera.getInfos() })

                        break;
                    
                    case 'envAnalyser': 
                        if (myRobot.status.envAnalyser[elem[1]] && myRobot.status.envAnalyser[elem[1]][elem[2]] && myRobot.status.envAnalyser[elem[1]][elem[2]].image) {
                            videosToStream.push({ image: myRobot.status.envAnalyser[elem[1]][elem[2]].image, source: ele })
                        }
                        break;
                        case 'test': 
                        if (myRobot.test && myRobot.test.image) {
                            videosToStream.push({ image: myRobot.test.image, source: ele })
                        }
                        break;
                        
                }
                resolve()
            })
        }))
        if(videosToStream.length){
            socket.emit('videoFrame', videosToStream);
        }
    }


    socket['userConfig']._timeOutFrameRate = setTimeout(() => {
        sendCameras(socket)
    }, 1000 / frameRate)
}







