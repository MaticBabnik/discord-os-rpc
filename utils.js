const cp = require("child_process");

function exec(command) {
    return new Promise((resolve, reject) => cp.exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        resolve(stdout);
    }))
}


const distroRegex = /Description:\s*(\S*(?:[\ \t]*\S*)*)/;

async function getLSBDistroName() {
    try {
        const lsb = await exec('lsb_release -a');

        return lsb?.match(distroRegex)?.[1] ?? "unknown";
    } catch {
        return "unknown";
    }
}

async function getKernelVersion() {
    try {
        const kernel = await exec('uname -r');

        return kernel?.trim() ?? 'UNKNOWN';
    } catch {
        return "unknown"
    }
}

async function getStartupTime() {
    try {
        const bootTime = await exec('uptime -s');

        return new Date(bootTime?.trim()) ?? new Date();

    } catch {
        return new Date();
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
        str += ` ${minutes} minutes${minutes > 1 ? 's' : ''}`;

    return str;
}

function checkCompatibility() {
    switch (process.platform) {
        case "linux":
            return;
        case "win32":
            throw "Ewwww Micro$oft software";
        case "darwin":
            throw "applefag BTFO!";
        default:
            if (process.platform.includes("bsd")) {
                throw "BSD schizo using Discord? really?";
            }
            throw "Unsupported platform";

    }
}


module.exports = { exec, getLSBDistroName, getKernelVersion, getStartupTime, formatUptime, checkCompatibility };