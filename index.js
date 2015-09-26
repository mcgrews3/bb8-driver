//Hiding my GUID's in cause anyone out there is within 30 meters ...

/*** IMPORT ***/

var chalk = require("chalk");
var cylonBLE = require('cylon-ble');
var Cylon = require('cylon');

var datajson = require('./data.json');
var bb8UUID = datajson.devices.bb8;

var ROBOT_SERVICE = '22bb746f2ba075542d6f726568705327';
var ROBOT_CHAR_COMMAND = '22bb746f2ba175542d6f726568705327';
var ROBOT_CHAR_NOTIFY = '22bb746f2ba675542d6f726568705327';

var BLE_RADIO_SERVICE = '22bb746f2bb075542d6f726568705327';
var BLE_RADIO_CHAR_RSSI = '22bb746f2bb675542d6f726568705327';

var DEVICE_INFO_SERVICE = '180a';
var DVC_INFO_CHAR_MANUFACTURER = '2a29';

/*** CONFIGURE ***/

Cylon.config({
    logging: {
        level: 'debug'
    }
});

/*** BLUETOOTH FUNCTIONS ***/

function discoverRobots() {
    Cylon.robot({
        connections: {
            bluetooth: {
                adaptor: 'central',
                module: 'cylon-ble'
            }
        },

        work: function (my) {
            var peripherals = {};

            my.bluetooth.on("discover", function (peripheral) {
                peripherals[peripheral.uuid] = peripheral;
            });

            console.log("Listening for BLE peripherals, one moment...");

            every((10).seconds(), function () {
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
                serviceId: DEVICE_INFO_SERVICE,
                characteristicId: DVC_INFO_CHAR_MANUFACTURER,
                connection: "bluetooth"
            }
        },

        work: function (my) {
            my.wiced.readCharacteristic(function (err, data) {
                if (err) {
                    return console.error("Error: ", err);
                }
                console.log("Data: ", data.toString('utf-8'));
            });
        }
    }).start();
}

/*** TEST BB8 METHODS ***/

function devModeOnBB8(callback) {
    console.log("devModeOnBB8");
    Cylon.robot({
        connections: {
            bluetooth: {adaptor: 'central', uuid: bb8UUID, module: 'cylon-ble'}
        },

        devices: {
            bb8: {driver: 'bb8'}
        },

        work: function (my) {
            my.bb8.devModeOn(function (err, dt) {
                console.log("devModeOnBB8.devModeOn", err, dt);
                if (callback) {
                    callback();
                }
            });
        }
    }).start();
}

function test() {
    console.log("testBB8", bb8UUID);

    Cylon.robot({
        connections: {
            bluetooth: {adaptor: 'central', uuid: bb8UUID, module: 'cylon-ble'}
        },

        devices: {
            bb8: {driver: 'bb8'}
        },

        work: function (my) {

            var obx = my.bb8.connection.connectedPeripherals['3d83fa5f2fa943cc811c2907c050f9d0'].peripheral;
            obx = my.bb8.connection;
            //ROBOT_SERVICE

            console.log("my.bb8", my.bb8);

            //my.bb8.discoverServices([], function(discoverError, discoverServices) {
            //   console.log(chalk.green("discoverServices", discoverError, discoverServices));
            //});

            var rollFn = function(rollError) {
                console.log("roll", rollError);
            };

            obx.on("connect", function (err, data) {
                console.log(chalk.yellow("connect", err, data));
            });

            obx.on("disconnect", function (err, data) {
                console.log(chalk.yellow("disconnect", err, data));
            });

            my.bb8.devModeOn(function (wakeError) {
                console.log("wake", wakeError);

                setTimeout(function() { console.log("red.color");  my.bb8.setRGB(0xFF0000, rollFn); }, 5000);
                setTimeout(function() { console.log("cyan.color"); my.bb8.setRGB(0x00FFFF, rollFn); }, 10000);

                my.bb8.roll(80, 80, 0, function (rollError, rollData) {
                    console.log("roll", rollError, rollData);

                });
            });

            setTimeout(function () {
                my.bb8.stop();
                console.log("exiting...");
                process.exit(0);
            },15000);

            /*
             my.bb8.devModeOn(function (wakeError) {
             console.log("wake", wakeError);
             my.bb8.setRGB(0xFF0000);
             setTimeout(function () {
             console.log("\texiting...");
             process.exit(0);
             }, 10000);
             });
             */
        }
    }).start();
}

/*** INIT ***/

test();