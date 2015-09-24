//Hiding my GUID's in cause anyone out there is within 30 meters ...
var datajson = require('./data.json');
var bb8UUID = datajson.devices.bb8;

var cylonBLE = require('cylon-ble');
var Cylon = require('cylon');
Cylon.config({
    logging: {
        level: 'debug'
    }
});

function discoverRobots() {
    Cylon.robot({
        connections: {
            bluetooth: {
                adaptor: 'central',
                module: __dirname + '/node_modules/cylon-ble'
            }
        },

        work: function (my) {
            var peripherals = {};

            my.bluetooth.on("discover", function (peripheral) {
                peripherals[peripheral.uuid] = peripheral;
            });

            console.log("Just listening for BLE peripherals, one moment...");

            every((5).seconds(), function () {
                console.log("Known Bluetooth Peripherals:");
                console.log("Name    | UUID                             | RSSI");
                console.log("------- | -------------------------------- | ----");

                for (var uuid in peripherals) {
                    var p = peripherals[uuid];

                    console.log([
                            p.advertisement.localName,
                            p.uuid,
                            p.rssi
                        ].join(" | ") + "\n");
                    console.log(p);
                }
            });
        }
    }).start();
}

function readCharacteristic() {
    Cylon.robot({
        connections: {
            bluetooth: {
                adaptor: "central",
                uuid: bb8UUID,
                module: "cylon-ble"
            }
        },

        devices: {
            wiced: {
                driver: "ble-characteristic",
                serviceId: '22bb746f2bb075542d6f726568705327',
                characteristicId: '22bb746f2bb075542d6f726568705327',
                connection: "bluetooth"
            }
        },

        work: function (my) {
            my.wiced.readCharacteristic(function (err, data) {
                if (err) {
                    return console.error("Error: ", err);
                }
                console.log("Data: ", data);
            });
        }
    }).start();
}

function genericAccess() {
    Cylon.robot({
        connections: {
            bluetooth: {
                adaptor: "central",
                uuid: bb8UUID,
                module: "cylon-ble"
            }
        },

        devices: {
            generic: {
                driver: "ble-generic-access"
            }
        },

        work: function (my) {
            console.log(my);
            my.generic.getDeviceName(function (err, data) {
                if (err) {
                    return console.error("Error: ", err);
                }
                console.log("Name: ", data);
            });
        }
    }).start();
}

function devModeOnBB8() {
    console.log("devModeOnBB8");
    Cylon.robot({
        connections: {
            bluetooth: {adaptor: 'central', uuid: bb8UUID, module: 'cylon-ble'}
        },

        devices: {
            bb8: {driver: 'bb8'}
        },

        work: function (my) {
            my.bb8.devModeOn(function(err, dt) {
                console.log("devModeOnBB8.devModeOn", err, dt);
            });
        }
    }).start();
}

function testBB8() {
    console.log("testBB8", bb8UUID);

    Cylon.robot({
        connections: {
            bluetooth: {adaptor: 'central', uuid: bb8UUID, module: 'cylon-ble'}
        },

        devices: {
            bb8: {driver: 'bb8'}
        },

        work: function (my) {
            //_getCharacteristic
            //_readServ
            //devModeOn
            /*
            my.bb8.devModeOn(function(wakeError, wakeData) {
                console.log("wake", wakeError, wakeData);
                console.log(my.bb8);
                my.bb8.setRGB(0x00ff00, function(rollError, rollData) {
                    console.log("roll", rollError, rollData);
                    after((3).seconds(), function() {
                        my.bb8.stop(function() {
                            my.bb8.wake(function(err, data) {
                                console.log("wake",err,data);
                                process.exit(0);
                            });
                        });

                    });

                });
            });
            */

            my.bb8.devModeOn(function (wakeError) {
                console.log("wake", wakeError);
                    my.bb8.setRGB(0xFF0000);
                    setTimeout(function() {
                        console.log("get BTInfo");
                        my.bb8.getBluetoothInfo(function(btError, btData) {
                            console.log("btInfo", btError, btData);
                        });
                    }, 5000);
                    setTimeout(function() {
                        console.log("\texiting...");
                        process.exit(0);
                    }, 10000);
            });
        }
    }).start();
}

function test() {
    console.log("test");
    var sphero = require('sphero');
    var ble = require("cylon-ble");
    var central = ble.adaptor({uuid: bb8UUID});
    console.log(central);
    var orb = sphero(bb8UUID, {adaptor: central});
    orb.connect(function () {
        console.log("orb connected");
        orb.color("magenta");
        orb.disconnect(function () {
            console.log("orb disconnected");
        });
    });

    /*
     var Cylon = require('cylon');

     Cylon.config({
     logging: {
     level: 'debug'
     }
     });

     Cylon.robot({
     connections: {
     bluetooth: { adaptor: 'central', uuid: bb8UUID, module: 'cylon-ble' }
     },

     devices: {
     sphero: { driver: 'sphero' }
     },

     work: function (my) {
     my.sphero.wake(function (err, data) {
     console.log("wake", err, data);

     my.bb8._readServiceCharacteristic("22bb746f2bb075542d6f726568705327", "22bb746f2bb975542d6f726568705327", function (err,response) {
     console.log(err,response);
     });
     });
     }
     }).start();
     */
}

//getDeviceInfo();
//genericAccess();
//readCharacteristic();
//discoverRobots();
//roll();
//connect();
//testOllie();

//devModeOnBB8();
testBB8();
//test();