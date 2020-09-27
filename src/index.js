Number.prototype.numMap = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const raspi = require('raspi');

const api = require('./api');

const robotStart = require('./myRobot/start');


raspi.init(() => {
    robotStart.init();

    api();
});
