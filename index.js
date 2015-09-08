var bb8UUID = '3d83fa5f2fa943cc811c2907c050f9d0';
bb8ServiceUUID = '22bb746f2ba075542d6f726568705327';
var chargeUUID = 'e2822f5b0a4948bcaa16c28b7b1ebade';
var Cylon = require('cylon');
var cylonBLE = require('cylon-ble');

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
				adaptor: "central", uuid: bb8UUID,
				module: "cylon-ble"
			}
		},

		devices: {
			wiced: {
				driver: "ble-characteristic",
				serviceId: bb8ServiceUUID,
				characteristicId: bb8UUID,
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
			console.log(my.deviceInfo);
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

//getDeviceInfo();
//genericAccess();
//readCharacteristic();
//discoverRobots();
//roll();
connect();