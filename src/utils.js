const childProc = require('child_process')

const
    SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR;

module.exports = {
    
    waitFor(object, event) {
        return new Promise(r => object.once(event, r))
    },

    $(strings, ...values) {
        let command = '';

        strings.forEach((str, i) => {
            command += str + (values[i] ?? '');
        });

        return new Promise((resolve, reject) => childProc.exec(command, (error, stdout) => {
            if (error) reject(error);
            resolve(stdout);
        }))
    },

    p$(strings, ...values) {
        let command = '';

        strings.forEach((str, i) => {
            command += str + (values[i] ?? '');
        });

        return new Promise((resolve, reject) => {
            childProc.exec(command, { 'shell': 'powershell.exe' }, (error, stdout) => {
                if (error) reject(error);
                resolve(stdout);
            });
        })
    },

    formatUptime(startupTime) {
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
}