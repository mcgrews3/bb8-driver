var robot = require('node-sphero');
var bb8 = new robot.Sphero();

bb8.on('connected', function(ball) {
	ball.set(0,255,0, false);
});

bb8.connect();