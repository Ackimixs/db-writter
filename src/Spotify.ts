import "dotenv/config.js";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getToken(): Promise<any> {
  try {
    const response = await fetch(
      `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log("Spotify Token fetched");
      return data.access_token;
    } else {
      console.log(
        "Could not fetch Spotify Token. Try resetting client id and secret",
        response.status,
        response.statusText
      );

      if (response.status === 429) {
        await sleep(
          (parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000
        );
        return await getToken();
      }
    }
  } catch (error) {
    console.log(
      "Could not fetch Spotify Token. Try resetting client id and secret"
    );
  }
}

async function search(token: string, q: string, limit = 10, type = ["track"]) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        q
      )}&type=${type.join(",")}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return await response.json();
    } else {
      return undefined;
    }
  } catch (error: any) {
    console.log(
      "Could not search on Spotify because of a networking error",
      error.message
    );
  }
}

async function searchPlaylist(token: string, q: string, limit = 10) {
  return await search(token, q, limit, ["playlist"]);
}

async function searchAlbum(token: string, q: string, limit = 10) {
  return await search(token, q, limit, ["album"]);
}

async function getAlbum(token: string, id: string): Promise<any> {
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
    } else {
      console.log(
        response.status,
        response.statusText,
        response.headers.get("Retry-After"),
        "retrying get album"
      );
      await sleep(
        (parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000
      );
      return await getAlbum(token, id);
    }
  } catch (error: any) {
    console.log(
      "Could not search on Spotify because of a networking error",
      error.message
    );
  }
}

async function getPlaylist(token: string, id: string): Promise<any> {
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
    } else {
      console.log(
        response.status,
        response.statusText,
        response.headers.get("Retry-After"),
        "retrying get playlist"
      );
      await sleep(
        (parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000
      );
      return await getPlaylist(token, id);
    }
  } catch (error: any) {
    console.log(
      "Could not search on Spotify because of a networking error",
      error.message
    );
  }
}

async function getTrack(token: string, id: string): Promise<any> {
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
    } else {
      console.log(
        response.status,
        response.statusText,
        response.headers.get("Retry-After"),
        "retrying get track"
      );
      await sleep(
        (parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000
      );
      return await getTrack(token, id);
    }
  } catch (error: any) {
    console.log(
      "Could not search on Spotify because of a networking error",
      error.message
    );
  }
}

async function getArtist(token: string, id: string): Promise<any> {
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
    } else {
      console.log(
        response.status,
        response.statusText,
        response.headers.get("Retry-After"),
        "retrying get artist"
      );
      await sleep(
        (parseInt(response.headers.get("Retry-After") || "0", 10) + 1) * 1000
      );
      return await getArtist(token, id);
    }
  } catch (error: any) {
    console.log(
      "Could not search on Spotify because of a networking error",
      error.message
    );
  }
}

export {
  getToken,
  search,
  searchPlaylist,
  getPlaylist,
  searchAlbum,
  getAlbum,
  getTrack,
  getArtist,
};
