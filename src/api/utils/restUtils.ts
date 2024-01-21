/*
 * Copyright (c) 2024 Šimon Sedlák snipeit.io All rights reserved.
 *
 * Licensed under the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007 (the "License");
 * You may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 */


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