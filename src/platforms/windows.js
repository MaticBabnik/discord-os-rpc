/**
 * ! What does the `getWindowsVersion` return? Does it return the Service Pack(on win7)?
 * 
 * !WARN! Earlier versions than Win 7 Windows don't have powershell
 */

const { p$, $ } = require('../utils');

// Eg. 'Windows 10 Enterprise'
async function getWindowsVersion() {
    try {
        const info = await $`systeminfo /FO CSV /NH`;

        return info?.split('","')[1].substr(10) ?? 'UNKNOWN';
    } catch {
        return "unknown"
    }
}

// Returns major.minor.build
async function getVersion() {
    const info = await $`systeminfo /FO CSV /NH`;
    return info?.match(/\d+\.\d+\.\d+/)[0] ?? 'UNKNOWN';
}

// Gets major version and returns appropriate logo
function getLogoByVersion(version) {
    const major = version.split('.')[0];
    if (['7', '8', '10', '11'].includes(major)) return major;
    return 'windows';
}

// On Win 10 gets 4 digit ver (like 20H2, 1909, ...)
async function getDisplayVersion() {
    const info = await p$`(Get-ItemProperty "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion").DisplayVersion`;
    return info?.trim() ?? 'UNKNOWN';
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
        const winVer = await getWindowsVersion() + ' ' + await getDisplayVersion();
        const version = await getVersion();
        return {
            name: winVer,
            kernel: version,
            bootTimestamp: await getLastBootupTime(),
            text: winVer.split(' ').slice(0, 2).join(' '),
            logo: getLogoByVersion(version),
        }
    }
};