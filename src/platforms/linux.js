const { $ } = require('../utils');

const DISTRO_REGEX = /Description:\s*(\S*(?:[\ \t]*\S*)*)/;

//TODO: add more distros
const DEFAULT_DISTRO = {text:"unknown",logo:"linux"}
const DISTRO_RESOLVER = {
    //pop is at the top since it is based on ubuntu, which is based on debian

    'pop': { text: "Pop! OS", logo: "pop" },

    'artix': { text: "Artix", logo: "artix" },
    'manjaro': { text: "Manjaro", logo: "manjaro" },
    'ubuntu': { text: "Ubuntu", logo: "ubuntu" },
    'fedora': { text: "Fedora", logo: "fedora" },

    'arch': { text: "Arch", logo: "arch" },
    'debian': { text: "Debian", logo: "debian" },
    'gentoo': { text: "Gentoo", logo: "gentoo" },

}

function resolveDistro(name) {
    for (key in DISTRO_RESOLVER) {
        const regex = new RegExp(key, 'gi');
        
        if (name.match(regex))
            return DISTRO_RESOLVER[key];
    }
    return DEFAULT_DISTRO;
}

//TODO: is lsb_release on all distros?(add a fallback???)
async function getLSBDistroName() {
    const lsb = await $`lsb_release -a`;

    return lsb?.match(DISTRO_REGEX)?.[1] ?? "unknown";
}

//TODO: is uname on all distros?(add a fallback???)
async function getKernelVer() {
    const kernel = await $`uname -r`;

    return kernel?.trim() ?? 'UNKNOWN';
}

async function getUptimeSince() {
    try {
        const bootTime = await $`uptime -s`;

        return new Date(bootTime?.trim()) ?? new Date();

    } catch {
        return new Date();
    }
}

module.exports = {
    name: "Linux",
    rpcId: "873578750128840744",
    async init() {
        const name = await getLSBDistroName();
        const {text,logo} = resolveDistro(name);
        return {
            name,
            text,
            logo,
            kernel: await getKernelVer(),
            bootTimestamp: await getUptimeSince(),
        }
    }
};