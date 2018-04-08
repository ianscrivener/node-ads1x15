var ads1x15 = require('node-ads1x15');
var chip = 0;                       //0 for ads1015, 1 for ads1115

var adc = new ads1x15(chip, 0x48, 'dev/i2c-0');

var channel = 0;                    //channel 0, 1, 2, or 3...
var samplesPerSecond = '250';       // see index.js for allowed values for your chip
var progGainAmp = '4096';           // see index.js for allowed values for your chip


// read a single value
var readingSingleEnded = 0;
if (!adc.busy) {
    adc.readADCSingleEnded(channel, progGainAmp, samplesPerSecond, function (err, data) {
        if (err) {
            //logging / troubleshooting code goes here...
            throw err;
        }
        // if you made it here, then the data object contains your reading!
        readingSingleEnded = data;
        // any other data processing code goes here...
    );
}