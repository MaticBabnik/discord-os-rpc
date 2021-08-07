const rpc = require('discord-rpc');
const utils = require('./utils');

rpc.register('873578750128840744');

let data = {
    distro: null,
    kernel: null,
    boot: null
};

const client = new rpc.Client({ transport: 'ipc' });

client.on('ready', async () => {
    data = {
        distro: await utils.getLSBDistroName(),
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
        details: `running ${data.distro} (kernel ${data.kernel})`,
        state: `up ${utils.formatUptime(data.boot)}`,
        largeImageKey: 'arch',
        largeImageText: 'Arch linux',
        instance: false,
        buttons: [
            { label: "Install Arch", url: "https://wiki.archlinux.org/title/Installation_guide" },
            { label: "or Manjaro", url: "https://manjaro.org/download/#kde-plasma" }
        ]
    });
}

client.login({ clientId: '873578750128840744' });
console.log('starting...');