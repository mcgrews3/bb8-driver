var async = require('async');
var noble = require('noble');
var datajson = require('./data.json');
var peripheralId = datajson.devices.bb8;
var chalk = require("chalk");

noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {
    if (peripheral.id === peripheralId) {
        noble.stopScanning();

        console.log('peripheral with ID ' + peripheralId + ' found');
        var advertisement = peripheral.advertisement;

        var localName = advertisement.localName;
        var txPowerLevel = advertisement.txPowerLevel;
        var manufacturerData = advertisement.manufacturerData;
        var serviceData = advertisement.serviceData;
        var serviceUuids = advertisement.serviceUuids;

        if (localName) {
            console.log('  Local Name        = ' + localName);
        }

        if (txPowerLevel) {
            console.log('  TX Power Level    = ' + txPowerLevel);
        }

        if (manufacturerData) {
            console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
        }

        if (serviceData) {
            console.log('  Service Data      = ' + serviceData);
        }

        if (localName) {
            console.log('  Service UUIDs     = ' + serviceUuids);
        }

        console.log();

        explore(peripheral);
        //test(peripheral);
    }
});

function test(peripheral) {
    console.log("test");

    peripheral.on('disconnect', function() {
        process.exit(0);
    });

    peripheral.connect(function(error) {
        console.log("connected");

        peripheral.discoverServices(["22bb746f2ba075542d6f726568705327"], function(error, services) {
            var serviceIndex = 0;

            for (var i = 0, j = services.length; i < j; i++) {
                var service = services[i];
                var serviceInfo = service.uuid;

                if (service.name) {
                    serviceInfo += ' (' + service.name + ')';
                }
                console.log(serviceInfo,"\n");

                service.discoverCharacteristics([], function(error, characteristics) {
                    console.log(characteristics);
                    console.log("disconnecting...");
                    peripheral.disconnect();
                });
            }

        });
    });
}

function explore(peripheral) {
    console.log('services and characteristics:');

    peripheral.on('disconnect', function() {
        process.exit(0);
    });

    peripheral.connect(function(error) {
        console.log("connected");


        peripheral.discoverServices([], function(error, services) {
            var serviceIndex = 0;

            async.whilst(
                function () {
                    return (serviceIndex < services.length);
                },
                function(callback) {
                    var service = services[serviceIndex];
                    var serviceInfo = service.uuid;

                    if (service.name) {
                        serviceInfo += ' (' + service.name + ')';
                    }
                    console.log(serviceInfo);

                    service.discoverCharacteristics([], function(error, characteristics) {
                        var characteristicIndex = 0;

                        async.whilst(
                            function () {
                                return (characteristicIndex < characteristics.length);
                            },
                            function(callback) {
                                var characteristic = characteristics[characteristicIndex];
                                var characteristicInfo = '  ' + characteristic.uuid;

                                if (characteristic.name) {
                                    characteristicInfo += ' (' + characteristic.name + ')';
                                }

                                async.series([
                                    function(callback) {
                                        characteristic.discoverDescriptors(function(error, descriptors) {
                                            async.detect(
                                                descriptors,
                                                function(descriptor, callback) {
                                                    return callback(descriptor.uuid === '2901');
                                                },
                                                function(userDescriptionDescriptor){
                                                    if (userDescriptionDescriptor) {
                                                        userDescriptionDescriptor.readValue(function(error, data) {
                                                            if (data) {
                                                                characteristicInfo += ' (' + data.toString() + ')';
                                                            }
                                                            callback();
                                                        });
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            );
                                        });
                                    },
                                    function(callback) {
                                        characteristicInfo += '\n    properties  ' + characteristic.properties.join(', ');

                                        if (characteristic.properties.indexOf('read') !== -1) {
                                            characteristic.read(function(error, data) {
                                                if (data) {
                                                    var string = data.toString('ascii');

                                                    characteristicInfo += '\n    value       ' + data.toString('hex') + ' | \'' + string + '\'';
                                                }
                                                callback();
                                            });
                                        }
                                        else if (characteristic.properties.indexOf('notify') !== -1) {
                                            characteristic.notify(true, function(error) {
                                                characteristic.on("data", function(data, isNotification) {
                                                    console.log("data",characteristic.uuid, data, isNotification);
                                                });
                                                characteristic.on("notify", function(state) {
                                                    console.log("notify",characteristic.uuid, state);
                                                });
                                                callback(error);
                                            });
                                        }
                                        else {
                                            callback();
                                        }
                                    },
                                    function() {
                                        console.log(characteristicInfo);
                                        characteristicIndex++;
                                        callback();
                                    }
                                ]);
                            },
                            function(error) {
                                serviceIndex++;
                                callback();
                            }
                        );
                    });
                },
                function (err) {
                    peripheral.disconnect();
                }
            );
        });
    });
}
