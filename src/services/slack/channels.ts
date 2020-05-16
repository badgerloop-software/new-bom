import * as channelsJSON from './channels.json';

export const channelMap  = new Map();

export const updateMap = () => {
    for(let name of Object.keys(channelsJSON)) {
        channelMap.set(name, channelsJSON[name]);
    }
}

updateMap();