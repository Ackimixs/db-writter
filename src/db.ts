import {
  getAlbum,
  getToken,
  getTrack,
  getPlaylist,
  getArtist,
} from "./Spotify";

import { PrismaClient } from "@prisma/client";

export class db {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  destroy() {
    this.prisma.$disconnect();
  }

  async addPlaylistTodb(token: string, id: string) {
    const playlist = await getPlaylist(token, id);

    const user = await this.prisma.user.findFirst({
      where: {
        email: "ackimixs@protonmail.com",
      },
    });

    const playlistDB = await this.prisma.playlist.upsert({
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
      let t = await this.prisma.music.findFirst({
        where: {
          name: track.name,
        },
      });

      if (!t) {
        await this.addAlbumToDb(token, track.album.id);

        t = await this.prisma.music.findFirst({
          where: {
            name: track.name,
          },
        });
      }

      if (t?.id) {
        await this.prisma.playlist.update({
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
  }

  async addAlbumToDb(token: string, id: string) {
    const album = await getAlbum(token, id);

    const albumDB = await this.prisma.album.create({
      data: {
        name: album.name,
        thumbnail: album.images.length > 0 ? album.images[0].url : "",
        spotifyId: album.id,
      },
    });

    for (const artist of album.artists) {
      await this.addArtistToDb(token, artist.id);

      await this.prisma.album.update({
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
      await this.addMusicToDb(token, track.id);

      await this.prisma.album.update({
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
  }

  async addArtistToDb(token: string, id: string) {
    const artists = await getArtist(token, id);

    return await this.prisma.artist.upsert({
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
  }

  async addMusicToDb(token: string, id: string) {
    console.log(id);
    const music = await getTrack(token, id);

    const musicDB = await this.prisma.music.create({
      data: {
        name: music.name,
        previewUrl: music.preview_url,
        thumbnail:
          music.album.images.length > 0 ? music.album.images[0].url : "",
        spotifyId: music.id,
        album: {
          connect: {
            spotifyId: music.album.id,
          },
        },
      },
    });

    for (const artist of music.artists) {
      await this.addArtistToDb(token, artist.id);

      await this.prisma.music.update({
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
  }
}
