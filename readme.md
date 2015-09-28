# BB8 Driver

## Links

### Cylon

* [Cylon Getting Started](http://cylonjs.com/documentation/getting-started/)
* [Cylon @ Github](https://github.com/hybridgroup/cylon)
* [Cylon BLE @ Github](https://github.com/hybridgroup/cylon-ble)
* [Cylon Ollie](http://cylonjs.com/documentation/platforms/ollie/)
* [Cylon Sphero](http://cylonjs.com/documentation/drivers/sphero/)

### Sphero

* [Sphero.js @ Github](https://github.com/orbotix/sphero.js)

### Cylon-ble

### BLE

* [Notifications w/Noble](https://labs.hybris.com/2014/10/06/connecting-to-multiple-ble-devices/)


#### info

peripheral with UUID  found
  Local Name        = BB-D911
  TX Power Level    = -10
  Manufacturer Data = 3330
  Service Data      = 
  Service UUIDs     = 

services and characteristics:

22bb746f2ba075542d6f726568705327 -    //2ba0  ?Robot Control Service
  22bb746f2ba175542d6f726568705327    //2ba1  Command
    properties  writeWithoutResponse, write   
  22bb746f2ba675542d6f726568705327    //2ba6  Response
    properties  notify
	
	
22bb746f2bb075542d6f726568705327 -    //2bb0  BLE Radio
  22bb746f2bb175542d6f726568705327    //2bb1 Handshake
    properties  read, write
  
  22bb746f2bb275542d6f726568705327    //2bb2  TXPower
    properties  write
  
  22bb746f2bb675542d6f726568705327    //2bb6 RSSI Notify
    properties  read, writeWithoutResponse, write, notify
    value       d1 | 'Q'
  
  22bb746f2bb775542d6f726568705327    //2bb7  DeepSleep
    properties  read, writeWithoutResponse, write
  
  22bb746f2bb875542d6f726568705327    //2bb8   CrystalTrim
    properties  read
    value       2c | ','
  
  22bb746f2bb975542d6f726568705327    //2bb9   ConnectionInterval
    properties  read
    value       0900 | '	'
  
  22bb746f2bba75542d6f726568705327    //2bba  ????
    properties  read
    value       c800 | 'H'
  
  22bb746f2bbd75542d6f726568705327    //2bbd  AntiDos
    properties  writeWithoutResponse, write
  
  22bb746f2bbe75542d6f726568705327    //2bbe AntiDOSTimeout
    properties  read, write
    value       1e | ''
  
  22bb746f2bbf75542d6f726568705327    //2bbf  Wake
    properties  read, writeWithoutResponse, write
    value       00 | ''
  
  22bb746f3bba75542d6f726568705327    //3bba ????
    properties  read, writeWithoutResponse, write
    value       0100 | ''
	
	
00001016d10211e19b2300025b00a5a5 -     //1016   
  00001013d10211e19b2300025b00a5a5 -          //1013
    properties  read, write
    value       01 | ''
  00001017d10211e19b2300025b00a5a5            //1017
    properties  write
  00001014d10211e19b2300025b00a5a5 -          //1014   
    properties  read, notify
    value        | ''
	
	
180a (Device Information)
  2a27 (Hardware Revision String)
    properties  read
    value       410000000000 | 'A'
  2a25 (Serial Number String)
    properties  read
    value       43313a36453a30343a35453a44393a3131 | 'C1:6E:04:5E:D9:11'
  2a24 (Model Number String)
    properties  read
    value       333000 | '30'
  2a29 (Manufacturer Name String)
    properties  read
    value       53706865726f | 'Sphero'
  2a26 (Firmware Revision String)
    properties  read
    value       312e3437 | '1.47'