#!/usr/bin/env nodejs

const { spawn } = require('child_process');

// Own variables
const DEVICE_NAME  = 'DLL0704:01 06CB:76AE Touchpad';
const infoCommand = spawn('xinput', ['list-props', DEVICE_NAME]);

infoCommand.stdout.on('data', (data) => {
    let config = data.toString().split('\n');

    let isDeviceEnabled = true;
    config.find((line, index) => {
        if(~line.indexOf('Device Enabled')){
            // console.log('TEST LINE', line);
            let result = line.trim().match(/\d$/);
            isDeviceEnabled = !!Number(result[0]);
            return true;
        }
    });

    const toggleCommand = spawn('xinput', [isDeviceEnabled ? 'disable' : 'enable', DEVICE_NAME]);
    toggleCommand.stderr.on('data', (data) => {
          console.log(`Toggle stderr: ${data}`);
    });

    toggleCommand.on('close', (code) => {
        if(code !== 0) {
            console.log(`Toggle command exited with ${code}`);
        } else {
            console.log(`Touchpad ${isDeviceEnabled ? 'disabled' : 'enabled'}`)
        }

    });
});

infoCommand.stderr.on('data', (data) => {
      console.log(`Info stderr: ${data}`);
});

infoCommand.on('close', (code) => {
    if(code !== 0) {
        console.log(`Info command exited with ${code}`);
    }
});
