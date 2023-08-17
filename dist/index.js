"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express = require("express");
const app = express();
const Spotify_1 = require("./Spotify");
const prisma = new client_1.PrismaClient();
app.listen(4000, () => {
    console.log("listening on port 4000");
});
const addPlaylistTodb = async (token, id) => {
    const playlist = await (0, Spotify_1.getPlaylist)(token, id);
    const user = await prisma.user.findFirst({
        where: {
            email: "ackimixs@protonmail.com",
        },
    });
    const playlistDB = await prisma.playlist.upsert({
        where: {
            spotifyId: playlist.id,
        },
        create: {
            spotifyId: playlist.id,
            name: playlist.name,
            author: {
                connect: {
                    id: user?.id,
                },
            },
        },
        update: {
            name: playlist.name,
            author: {
                connect: {
                    id: user?.id,
                },
            },
        },
    });
    for (const { track } of playlist.tracks.items) {
        let t = await prisma.music.findFirst({
            where: {
                name: track.name,
            },
        });
        if (!t) {
            await addAlbumToDb(token, track.album.id);
            t = await prisma.music.findFirst({
                where: {
                    name: track.name,
                },
            });
        }
        if (t?.id) {
            await prisma.playlist.update({
                where: {
                    id: playlistDB.id,
                },
                data: {
                    musics: {
                        connect: {
                            id: t.id,
                        },
                    },
                },
            });
        }
    }
};
const addAlbumToDb = async (token, id) => {
    const album = await (0, Spotify_1.getAlbum)(token, id);
    const albumDB = await prisma.album.create({
        data: {
            name: album.name,
            thumbnail: album.images.length > 0 ? album.images[0].url : "",
            spotifyId: album.id,
        },
    });
    for (const artist of album.artists) {
        await addArtistToDb(token, artist.id);
        await prisma.album.update({
            where: {
                id: albumDB.id,
            },
            data: {
                artists: {
                    connect: {
                        spotifyId: artist.id,
                    },
                },
            },
        });
    }
    for (const track of album.tracks.items) {
        await addMusicToDb(token, track.id);
        await prisma.album.update({
            where: {
                id: albumDB.id,
            },
            data: {
                musics: {
                    connect: {
                        spotifyId: track.id,
                    },
                },
            },
        });
    }
};
const addArtistToDb = async (token, id) => {
    const artists = await (0, Spotify_1.getArtist)(token, id);
    return await prisma.artist.upsert({
        where: {
            spotifyId: artists.id,
        },
        create: {
            spotifyId: artists.id,
            name: artists.name,
            thumbnail: artists.images.length > 0 ? artists.images[0].url : "",
        },
        update: {
            spotifyId: artists.id,
            name: artists.name,
            thumbnail: artists.images.length > 0 ? artists.images[0].url : "",
        },
    });
};
const addMusicToDb = async (token, id) => {
    console.log(id);
    const music = await (0, Spotify_1.getTrack)(token, id);
    const musicDB = await prisma.music.create({
        data: {
            name: music.name,
            previewUrl: music.preview_url,
            thumbnail: music.album.images.length > 0 ? music.album.images[0].url : "",
            spotifyId: music.id,
            album: {
                connect: {
                    spotifyId: music.album.id,
                },
            },
        },
    });
    for (const artist of music.artists) {
        await addArtistToDb(token, artist.id);
        await prisma.music.update({
            where: {
                spotifyId: music.id,
            },
            data: {
                artists: {
                    connect: {
                        spotifyId: artist.id,
                    },
                },
            },
        });
    }
    return musicDB;
};
app.get("/api/spotify/playlist", async (req, res) => {
    const token = await (0, Spotify_1.getToken)();
    const playlistId = req.query.playlistId;
    console.log(playlistId);
    if (playlistId) {
        await addPlaylistTodb(token, playlistId);
        res.send("ok");
    }
    else {
        res.send("bad request");
    }
});
process.on("exit", () => {
    console.log("exit");
    prisma.$disconnect();
});
process.on("SIGINT", () => {
    process.exit(0);
});
