"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtist = exports.getTrack = exports.getAlbum = exports.searchAlbum = exports.getPlaylist = exports.searchPlaylist = exports.search = exports.getToken = void 0;
require("dotenv/config.js");
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getToken() {
    try {
        const response = await fetch(`https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        if (response.status === 200) {
            const data = await response.json();
            console.log("Spotify Token fetched");
            return data.access_token;
        }
        else {
            console.log("Could not fetch Spotify Token. Try resetting client id and secret", response.status, response.statusText);
            if (response.status === 429) {
                await sleep((parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000);
                return await getToken();
            }
        }
    }
    catch (error) {
        console.log("Could not fetch Spotify Token. Try resetting client id and secret");
    }
}
exports.getToken = getToken;
async function search(token, q, limit = 10, type = ["track"]) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type.join(",")}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return await response.json();
        }
        else {
            return undefined;
        }
    }
    catch (error) {
        console.log("Could not search on Spotify because of a networking error", error.message);
    }
}
exports.search = search;
async function searchPlaylist(token, q, limit = 10) {
    return await search(token, q, limit, ["playlist"]);
}
exports.searchPlaylist = searchPlaylist;
async function searchAlbum(token, q, limit = 10) {
    return await search(token, q, limit, ["album"]);
}
exports.searchAlbum = searchAlbum;
async function getAlbum(token, id) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return await response.json();
        }
        else {
            console.log(response.status, response.statusText, response.headers.get("Retry-After"), "retrying get album");
            await sleep((parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000);
            return await getAlbum(token, id);
        }
    }
    catch (error) {
        console.log("Could not search on Spotify because of a networking error", error.message);
    }
}
exports.getAlbum = getAlbum;
async function getPlaylist(token, id) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return await response.json();
        }
        else {
            console.log(response.status, response.statusText, response.headers.get("Retry-After"), "retrying get playlist");
            await sleep((parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000);
            return await getPlaylist(token, id);
        }
    }
    catch (error) {
        console.log("Could not search on Spotify because of a networking error", error.message);
    }
}
exports.getPlaylist = getPlaylist;
async function getTrack(token, id) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return await response.json();
        }
        else {
            console.log(response.status, response.statusText, response.headers.get("Retry-After"), "retrying get track");
            await sleep((parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000);
            return await getTrack(token, id);
        }
    }
    catch (error) {
        console.log("Could not search on Spotify because of a networking error", error.message);
    }
}
exports.getTrack = getTrack;
async function getArtist(token, id) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            return await response.json();
        }
        else {
            console.log(response.status, response.statusText, response.headers.get("Retry-After"), "retrying get artist");
            await sleep((parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000);
            return await getArtist(token, id);
        }
    }
    catch (error) {
        console.log("Could not search on Spotify because of a networking error", error.message);
    }
}
exports.getArtist = getArtist;
