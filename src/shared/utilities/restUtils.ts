import * as crypto from "crypto";

export function antiSQLInjection(input:string): string {
    input = replaceAll(input, "'", "''");
    input = replaceAll(input, "\\", "\\\\");
    input = replaceAll(input, "\0", "\\0");
    input = replaceAll(input, "\n", "\\n");
    input = replaceAll(input, "\r", "\\r");
    input = replaceAll(input, "\"", "\\\"");
    input = replaceAll(input, "\\x1a", "\\Z");

    return input;
}

export function isSQLInjections(...input: string[]): boolean {
    for (let i = 0; i < input.length; i++) {
        if(isSQLInjection(input[i])) return true;
    }
    return false;
}

export function isSQLInjection(input: string): boolean {
    const replacements = [
        "'",
        "\\",
        "\0",
        "\n",
        "\r",
        "\"",
        "\\x1a",
    ];

    for (const item of replacements) {
        if (input.includes(item)) {
            return true;
        }
    }

    return false;
}
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



export default {antiSQLInjection, isSQLInjections, utf8_to_latin1, latin1_to_utf8, replaceAll, formatUptime}