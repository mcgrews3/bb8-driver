var bb8UUID = '3d83fa5f2fa943cc811c2907c050f9d0';
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
				}
			});
		}
	}).start();
}

function readCharacteristics() {
	Cylon.robot({
		connections: {
			bluetooth: {
				adaptor: "central", uuid: chargeUUID,
				module: "cylon-ble"
			}
		},

		devices: {
			wiced: {
				driver: "ble-characteristic",
				serviceId: "180f", characteristicId: "2a19",
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

readCharacteristics();