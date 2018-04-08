var ads1x15 = require('node-ads1x15');
var chip = 0;                       //0 for ads1015, 1 for ads1115

var adc = new ads1x15(chip, 0x48, 'dev/i2c-0');

var channel = 0;                    //channel 0, 1, 2, or 3...
var samplesPerSecond = '250';       // see index.js for allowed values for your chip
var progGainAmp = '4096';           // see index.js for allowed values for your chip

var readingDifferencial = 0;
if (!adc.busy) {
    adc.readADCDifferential(channel1, channel2, progGainAmp, samplesPerSecond, function (err, data) {
        if (err) {
            //logging / troubleshooting code goes here...
            throw err;
        }
        // if you made it here, then the data object contains your reading!
        readingDifferencial = data;
        // any other data processing code goes here...
    );
}