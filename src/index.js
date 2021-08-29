const rpc = require('discord-rpc');
const { waitFor, formatUptime } = require('./utils');

function getPlatformModule() {
    switch (process.platform) {
        case "linux":
            return require('./platforms/linux');
        case "win32":
            return require('./platforms/windows');
        case "darwin":
            return require('./platforms/osx');
    }
}


const platform = getPlatformModule();


async function main() {
    rpc.register(platform.rpcId);
    const client = new rpc.Client({ transport: "ipc" })
    
    client.login({clientId:platform.rpcId});
    console.log("Getting info & starting RPC");
    const data = (await Promise.all([waitFor(client, "ready"), platform.init()]))[1];
    console.log("Setting status");
    setStatus(client,data);
    setInterval(()=>setStatus(client,data),15_000);
}

//TODO add buttons that are read from a config file or something?
function setStatus(client,data) {
    client.setActivity({
        details: `${data.name} [${data.kernel}]`,
        state: `up ${formatUptime(data.bootTimestamp)}`,
        largeImageKey: data.logo,
        largeImageText: data.text,
        instance: false,
    })
}

main();