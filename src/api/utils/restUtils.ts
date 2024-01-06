function escapeRegExp(str:any) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAll(str:any, find:any, replace:any) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function utf8_to_latin1(str:any) {
    return unescape(encodeURIComponent(str));
}
export function latin1_to_utf8(str:any) {
    return decodeURIComponent(escape(str));
}

export function formatUptime(uptimeInSeconds: number): string {
    const pad = (s: number) => (s < 10 ? '0' : '') + s;
    const days = Math.floor(uptimeInSeconds / (24 * 60 * 60));
    const hours = Math.floor(uptimeInSeconds % (24 * 60 * 60) / (60 * 60));
    const minutes = Math.floor(uptimeInSeconds % (60 * 60) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    return `${pad(days)}D:${pad(hours)}H:${pad(minutes)}M:${pad(seconds)}S`;
}



export default {utf8_to_latin1, latin1_to_utf8, replaceAll, formatUptime}