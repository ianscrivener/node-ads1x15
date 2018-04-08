/*

continuous conversion would of course tie up the I2C serial bus
... so would only be appropriate where there was one (i) ADS and one channel to be sensed

*/




var ads1x15             = require('node-ads1x15');

var chip                = 0;                       //0 for ads1015, 1 for ads1115
var adc                 = new ads1x15(chip, 0x48, 'dev/i2c-0');

var channel             = 0;                        //channel 0, 1, 2, or 3...
var samplesPerSecond    = '8';                      // for slow moving analoge (<125ms) you get better accuracy by taking advantage of the internal de-noising/averaging of the ADS
var progGainAmp         = '4096';                   // see index.js for allowed values for your chip

