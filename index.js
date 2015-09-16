
//Hiding my GUID's in cause anyone out there is within 30 meters ...
var data = require('./data.json');

var bb8ServiceUUID = '22bb746f2ba075542d6f726568705327';
var bb8UUID = data.devices.bb8;
var chargeUUID = data.devices.charge;
var Cylon = require('cylon');
var cylonBLE = require('cylon-ble');

console.log(bb8UUID);

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
	var Cylon = require("cylon");

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
				if (err) { return console.error("Error: ", err); }
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
				if (err) { return console.error("Error: ", err); }
				console.log("Name: ", data);
			});
		}
	}).start();
}

function roll() {
	Cylon.robot({
		connections: {
			bluetooth: { adaptor: "central", uuid: bb8UUID, module: "cylon-ble" }
		},

		devices: {
			ollie: { driver: "ollie" }
		},

		work: function (my) {
			my.ollie.wake(function () {
				every((1).second(), function () {
					my.ollie.setRGB(Math.floor(Math.random() * 100000));
				});
			});
		}
	}).start();
}

function getDeviceInfo() {
	var Cylon = require("cylon");

	Cylon.robot({
		connections: {
			bluetooth: { adaptor: "central", uuid: bb8UUID, module: "cylon-ble" }
		},

		devices: {
			deviceInfo: { driver: "ble-device-information" }
		},

		work: function (my) {
			console.log(my);
			my.deviceInfo.getManufacturerName(function (err, data) {
				if (err) {
					console.log("error: ", err);
					return;
				}

				console.log("data: ", data);
			});
		}
	}).start();
}

function connect() {
	Cylon.robot({
		connections: {
			bluetooth: { adaptor: "central", module: __dirname + "/node_modules/cylon-ble" }
		},

		connectBLE: function (peripheral) {
			if (this.connected) { return; }
			console.log(peripheral);

			this.bluetooth.connectPeripheral(peripheral.uuid, peripheral, function () {
				console.log(peripheral.advertisement.localName, peripheral.uuid);
				this.connected = true;
				this.device("blething",
					{ connection: "bluetooth", driver: "ble-device-information" });
				this.devices.blething.getManufacturerName(function (err, data) {
					if (err) {
						console.log("error: ", err);
						return;
					}
					console.log("data: ", data);
				});
			}.bind(this));
		},

		work: function (my) {
			this.connected = false;

			my.bluetooth.on("discover", function (peripheral) {
				my.connectBLE(peripheral);
			});
		}
	}).start();
}

function testOllie() {
	console.log("testOllie");
	Cylon.robot({
		connections: {
			bluetooth: { adaptor: 'central', uuid: bb8UUID, module: 'cylon-ble' }
		},

		devices: {
			ollie: { driver: 'ollie' }
		},

		work: function (my) {
			console.log("WORK", my)
			my.ollie.wake(function (err, data) {
				console.log("wake");

				after(200, function () {
					my.ollie.setRGB(0x00FFFF);
				});

				after(500, function () {
					my.ollie.setRGB(0xFF0000);
					my.ollie.roll(60, 0, 1);

					after(1000, function () {
						my.ollie.roll(60, 90, 1);

						after(1000, function () {
							my.ollie.stop();
						});
					});
				});
			});
		}
	}).start();
}

//getDeviceInfo();
genericAccess();
//readCharacteristic();
//discoverRobots();
//roll();
//connect();
//testOllie();