const cp = require("child_process");

function exec(command) {
    return new Promise((resolve, reject) => cp.exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        resolve(stdout);
    }))
}

function execPS(command) {
    return new Promise((resolve, reject) => cp.exec(command, { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
        if (error) reject(error);
        resolve(stdout);
    }))
}


const distroRegex = /Description:\s*(\S*(?:[\ \t]*\S*)*)/;

async function getDistroName() {
    switch (process.platform) {
        case 'linux':
            return getLSBDistroName();
        case 'win32':
            return getWinDistroName();
        case 'darwin':
            return getMacDistroName();
    }
}

async function getLSBDistroName() {
    try {
        const lsb = await exec('lsb_release -a');

        return lsb?.match(distroRegex)?.[1] ?? "unknown";
    } catch {
        return "unknown";
    }
}

async function getMacDistroName() {
    const version = (await exec('sw_vers -productVersion'))
        .split(/\./g)[1];

    const distroName = ["PumaCheetah", "Jaguar", "Panther", "Tiger", "Leopard", "Snow Leopard", "Lion", "Mountain Lion", "Mavericks", "Yosemite", "El Capitan", "Sierra", "High Sierra", "Mojave", "Catalina", "Big Sur", "Monterey"]
    [version - 1];
    return distroName;
}

async function getWinDistroName() {
    try {
        const info = await exec('systeminfo /FO CSV /NH');

        return info?.split('","')[1].substr(10) ?? 'UNKNOWN';
    } catch {
        return "unknown"
    }
}

async function getKernelVersion() {
    switch (process.platform) {
        case 'linux':
            return getLinuxKernelVersion();
        case 'win32':
            return getWinKernelVersion();
        case 'darwin':
            return getMacKernelVersion();
    }
}

async function getLinuxKernelVersion() {
    try {
        const kernel = await exec('uname -r');

        return kernel?.trim() ?? 'UNKNOWN';
    } catch {
        return "unknown"
    }
}

async function getMacKernelVersion() {
    try {
        const kernel = await exec('uname -r');

        return kernel?.trim() ?? 'UNKNOWN';
    } catch {
        return "unknown";
    }
}

async function getWinKernelVersion() {
    try {
        const info = await exec('systeminfo /FO CSV /NH');

        return info?.split('","')[2].split(' ')[0] ?? 'UNKNOWN';
    } catch {
        return "unknown";
    }
}

async function getStartupTime() {
    switch (process.platform) {
        case 'linux':
            return getLinuxStartupTime();
        case 'win32':
            return getWinStartupTime();
        case 'darwin':
            return getMacStartupTime();
        default:
            return new Date();
    }
}

async function getLinuxStartupTime() {
    try {
        const bootTime = await exec('uptime -s');

        return new Date(bootTime?.trim()) ?? new Date();

    } catch {
        return new Date();
    }
}

async function getMacStartupTime() {
    try {
        const bootTime = await exec('sysctl -n kern.boottime');

        return new Date(bootTime.replace(/{.*}/));
    } catch {
        return "unknown";
    }
}

async function getWinStartupTime() {
    try {
        const info = await execPS('Get-Date (gcim Win32_OperatingSystem).LastBootUpTime -Format "o"');

        return new Date(info?.trim()) ?? new Date();
    } catch {
        return "unknown"
    }
}

const
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR;

function formatUptime(startupTime) {
    let uptime = Date.now() - startupTime;

    let days = Math.floor(uptime / DAY);
    uptime %= DAY;
    let hours = Math.floor(uptime / HOUR);
    uptime %= HOUR;
    let minutes = Math.floor(uptime / MINUTE);
    uptime %= MINUTE;

    let str = '';
    if (days > 0)
        str += `${days} day${days > 1 ? 's' : ''} `;
    if (hours > 0)
        str += `${hours} hour${hours > 1 ? 's' : ''}`;
    if (days == 0)
        str += ` ${minutes} minute${minutes > 1 ? 's' : ''}`;

    return str;
}

function checkCompatibility() {
    switch (process.platform) {
        case "linux":
        case "win32":
        case "darwin":
            return;
        default:
            if (process.platform.includes("bsd")) {
                throw "BSD schizo using Discord? really?";
            }
            throw "Unsupported platform";

    }
}

function getButtons() {
    switch (process.platform) {
        case 'linux':
            return [
                { label: "Install Arch", url: "https://wiki.archlinux.org/title/Installation_guide" },
                { label: "or Manjaro", url: "https://manjaro.org/download/#kde-plasma" }
            ];
        default:
            return [
                { label: "Install Arch", url: "https://wiki.archlinux.org/title/Installation_guide" },
                { label: "or Manjaro", url: "https://manjaro.org/download/#kde-plasma" }
            ];
    }
}

module.exports = { exec, getButtons, getDistroName, getKernelVersion, getStartupTime, formatUptime, checkCompatibility };