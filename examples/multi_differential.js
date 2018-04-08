/*

Calculating SPS & readingsPerSecond variables

    +-----------+------------------+-------+-----+-------------+-------------------+---------------------
    | ADS Count | Ch pairs per ADS | total | SPS | msPerSample | readingsPerSecond | totalReadTime (ms) |
    +-----------+------------------+-------+-----+-------------+-------------------+---------------------
    |         1 |                1 |     1 |   8 |       0.125 |                 7 |              0.875 |
    |         1 |                2 |     2 |  16 |      0.0625 |                 7 |              0.875 |
    |         2 |                1 |     2 |  16 |      0.0625 |                 7 |              0.875 |
    |         3 |                1 |     3 |  16 |      0.0625 |                 5 |             0.9375 |
    |         2 |                2 |     4 |  32 |     0.03125 |                 7 |              0.875 |
    |         4 |                1 |     4 |  32 |     0.03125 |                 7 |              0.875 |
    |         3 |                2 |     6 |  64 |    0.015625 |                10 |             0.9375 |
    |         4 |                2 |     8 |  64 |    0.015625 |                 7 |              0.875 |
    |           |                  |       |     |             |                   |                    |
    +-----------+------------------+-------+-----+-------------+-------------------+---------------------
    msPerSample       = 1 / SPS
    totalReadTime     = msPerSample * readingsPerSecond

    Roughly
        High read time  = low noise
        Low read time   = low power consumption



Calculating readInterval

        =(1000-deadBand)/readings
    +-------------------+--------------+-----------------+
    | readingsPerSecond | dead band ms | readInterval ms |
    +-------------------+--------------+-----------------+
    |                 1 |          100 |             900 |
    |                 2 |          100 |             450 |
    |                 3 |          100 |             300 |
    |                 4 |          100 |             225 |
    |                 5 |          100 |             180 |
    |                 6 |          100 |             150 |
    |                 7 |          100 |             129 |
    |                 8 |          100 |             113 |
    |                 9 |          100 |             100 |
    |                10 |          100 |              90 |
    +-------------------+--------------+-----------------+


*/




var NanoTimer           = require('nanotimer');
var ads1x15             = require('node-ads1x15');


var chip                = 0;                        // 0 for ads1015, 1 for ads1115
var i2cBus              = 'dev/i2c-0';              //
var progGainAmp         = '4096';                   //

var samplesPerSecond    = '32';                     // See tables at top
var readInterval        = 129;                      // See tables at top
var adsPairs = [                                    // See tables at top
        {addr: 0x48, ch1: 0, ch2: 1},
        {addr: 0x49, ch1: 0, ch2: 1},
        {addr: 0x58, ch1: 0, ch2: 1},
        {addr: 0x59, ch1: 0, ch2: 1}
    ];

var sensorCount         = Object.keys(adsPairs).length;

var sensorIndex         = 0;
var adcConnections      = [];
var initDone            = false;


// init function
var init = function () {
    if (!adc.busy) {
        adsPairs.forEach(function (thisValue, thisIndex) {
            adcConnections[thisIndex] = new ads1x15(chip, thisValue.addr, i2cBus);
        });
        initDone = true;
    }
};

// try to init immediately
init();




// main working function
var doAdsReading = function(){

    // skip if init has not yet been completed
    if(!initDone){
        init();
        return;
    }

    // read ads
    adcConnections[sensorIndex].readADCDifferential(adsPairs[sensorIndex].ch1, adsPairs[sensorIndex].ch2, progGainAmp, samplesPerSecond, function (err, data) {
        if (err) {
            console.log('Error:', err);
        }

        else {
            // handle your datae here... for now we'll just print put a json object with a Unix Time timestamp
            console.log({time: Date.now(), id: sensorIndex, val: data});

            // increment sensor index
            sensorIndex = sensorIndex + 1;
            if(sensorIndex >= sensorCount){
                sensorIndex = 0;
            }
            // which could also be written in one line as a ternary
            // sensorIndex = sensorIndex === sensorCount-1 ? 0 : sensorIndex+1;
        }

    )};


// setup an ACCURATE time to to ADS periodically
var timer = new NanoTimer();

// read the next sensor every ${readInterval} milliseconds
timer.setInterval(doAdsReading, '', readInterval + 'm');

