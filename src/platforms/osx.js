const { $ } = require('../utils');

//anything older than sierra is prolly irrelavant...
//TODO verify this still works?
const OS_NAMES = ["Cheetah", "Puma", "Jaguar",
    "Panther", "Tiger", "Leopard", "Snow Leopard",
    "Lion", "Mountain Lion", "Mavericks", "Yosemite",
    "El Capitan", "Sierra", "High Sierra", "Mojave",
    "Catalina", "Big Sur", "Monterey"]


async function getOSName() {
    const version = (await $`sw_vers -productVersion`)
        .split(/\./g)[1];

    const distroName = OS_NAMES[version];
    return distroName;
}

async function getKernelVer() {
    const kernel = await exec('uname -r');

    return kernel?.trim() ?? 'UNKNOWN';
}

async function getBootTime() {
    try {
        const bootTime = await exec('sysctl -n kern.boottime');

        return new Date(bootTime.replace(/{.*}/));
    } catch {
        return "unknown";
    }
}

module.exports = {
    name: "macOS",
    rpcId: "874305839920447529",
    async init() {
        return {
            name: await getOSName(),
            kernel: getKernelVer(),
            bootTimestamp: await getBootTime(),
            text:"apple", //TODO fixme
            logo:"apple" //TODO more logos?
        }
    }
};