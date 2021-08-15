/**
 * ! Hello windows users, this file was refactored on linux... I have no idea how this works.
 * ! What does the `getWindowsVersion` return? Does it return the Service Pack(on win7)?
 * ! Also on windows 10 we should probably show the 4 digit ver (like 20H2, 1909 and stuff...)
 */

const { p$, $h } = require('../utils');

async function getWindowsVersion() {
    try {
        const info = await $`systeminfo /FO CSV /NH`;

        return info?.split('","')[1].substr(10) ?? 'UNKNOWN';
    } catch {
        return "unknown"
    }
}

//? what exactly does this return
async function getKernelVer() {
    const info = await exec('systeminfo /FO CSV /NH');
    //TODO: use a regex?
    return info?.split('","')[2].split(' ')[0] ?? 'UNKNOWN';
}

async function getLastBootupTime() {
    try {
        const info = await p$`Get-Date (gcim Win32_OperatingSystem).LastBootUpTime -Format "o"`;

        return new Date(info?.trim()) ?? new Date();
    } catch {
        return "unknown"
    }
}

module.exports = {
    name: "Windows",
    rpcId: "874305329079386122",
    async init() {
        return {
            name: await getWindowsVersion(),
            kernel: await getKernelVer(),
            bootTimestamp: await getLastBootupTime(),
            text:'TODO',//TODO detect 7/8/8.1/10
            logo:'windows' //TODO request more logos
        }
    }
};