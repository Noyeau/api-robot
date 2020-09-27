

let ioReady = true;

let emitIoRate=4


/**
 * Lancé à chaque mise à jour des capteurs
 */
module.exports = function onSensorUpdate() {
    obstacleProposeMouv()







}



/**
 * Lancé à chaque mise à jour des capteurs
 */
function obstacleProposeMouv() {

    /**
     * On envoie les data aux client via SocketIo tous les 500ms max
     */
    // if (myRobot.io && ioReady) {
    //     ioReady = false;
    //     myRobot.io.emit("status", myRobot.status);
    //     setTimeout(() => { ioReady = true }, 500)
    // }


    /**
     * En cas de détection d'obstacle
     */
    let minDist=false;
    /**
     * Insérer tous les capteurs de proximité qui retournent une distance (cm)
     */
    const captDistList=[
        myRobot.status.sensors.radar['0']
    ]

    captDistList.map(capt=>{
        if(capt >=0){
            if(minDist == false || minDist>capt){
                minDist=capt
            }
        }
    })
    myRobot.status.obstacle.minDist=minDist;

    
    let nextMouv = { x: 0, y: 0 }
    if (myRobot.status.sensors.radar['0'] < 13) {
        nextMouv.y -= 0.5
    }
    if (!myRobot.status.sensors.ir.top) {
        nextMouv.y -= 0.5
    }
    if (!myRobot.status.sensors.ir.topRight) {
        nextMouv.y -= 0.5
        nextMouv.x -= 0.5
    }
    if (!myRobot.status.sensors.ir.right) {
        nextMouv.x -= 0.5
    }
    if (!myRobot.status.sensors.ir.bottomRight) {
        nextMouv.x -= 0.5
        nextMouv.y += 0.5
    }
    if (!myRobot.status.sensors.ir.bottom) {
        nextMouv.y += 0.5
    }
    if (!myRobot.status.sensors.ir.bottomLeft) {
        nextMouv.y += 0.5
        nextMouv.x += 0.5
    }
    if (!myRobot.status.sensors.ir.left) {
        nextMouv.x += 0.5
    }
    if (!myRobot.status.sensors.ir.topLeft) {
        nextMouv.y -= 0.5
        nextMouv.x += 0.5
    }
    // if ((nextMouv.x !== 0 || nextMouv.y !== 0) || myRobot.status.sensors.obstacle) {
    //     switch (myRobot.params.obstacleReaction) {
    //         case "back":
    //             myRobot.aiMotors.goTo(nextMouv.x, nextMouv.y);
    //             break;
    //         default:
    //             myRobot.aiMotors.stop();
    //             break
    //     }
    // }



    if (nextMouv.x !== 0 || nextMouv.y !== 0) {
        myRobot.status.sensors.obstacle = true
        myRobot.status.propositionMouv = nextMouv
    } else {
        myRobot.status.sensors.obstacle = false
        myRobot.status.propositionMouv = null
    }

}