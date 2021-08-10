const rpc = require('discord-rpc');
const utils = require('./utils');

utils.checkCompatibility();

let rpcId;
switch (process.platform) {
    case 'linux':
        rpcId = '873578750128840744';
        break;
    case 'win32':
        rpcId = '874371922568282162';
        break;
}

rpc.register(rpcId);

let data = {
    distro: null,
    kernel: null,
    boot: null
};

const _buttons = utils.getButtons();

const client = new rpc.Client({ transport: 'ipc' });

client.on('ready', async () => {
    data = {
        distro: await utils.getDistroName(),
        kernel: await utils.getKernelVersion(),
        boot: await utils.getStartupTime()
    };
    console.log('fethced data');
    console.log(data);
    setActivity();
    setInterval(setActivity, 15_000);
});

function setActivity() {
    console.log('setting activity');

    client.setActivity({
        details: `${data.distro} (${getDetailsKernelLabel()}${data.kernel})`,
        state: `up ${utils.formatUptime(data.boot)}`,
        largeImageKey: getImageKey(),
        largeImageText: getImageText(),
        instance: false,
        buttons: _buttons
    });
}

function getImageKey() {
    switch (process.platform) {
        case 'linux':
            return 'arch';
        case 'win32':
            return 'win';
    }
}

function getImageText() {
    switch (process.platform) {
        case 'linux':
            return 'Arch linux';
        case 'win32':
            return 'Windows';
    }
}

function getDetailsKernelLabel() {
    switch (process.platform) {
        case 'linux':
            return 'kernel ';
    }
    return '';
}

client.login({ clientId: rpcId });
console.log('starting...');