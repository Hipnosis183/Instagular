const { IgApiClient } = require('instagram-private-api');

const fetch = require('node-fetch');
module.exports.encode = (req, res, next) => {
  ; (async () => {
    // Create URL object to get the hostname.
    const host = new URL(req.body.url);
    // Fetch image data from url.
    const body = await fetch(req.body.url, { mode: 'GET', headers: { Host: host.hostname } });
    // Convert image to blob.
    let blob = await body.blob()
      .then(async (res) => {
        // Get actual image binary data.
        return await res.arrayBuffer();
      });
    // Convert blob data to Base64.
    let bufferBase64 = Buffer.from(blob, 'binary').toString('base64');
    // Return formatted data to use as an image.
    let encodeType = req.body.video ? 'data:video/mp4;base64,' : 'data:image/png;base64,';
    let encodedBase64 = encodeType + bufferBase64;
    res.status(200);
    res.json(encodedBase64);
  })();
};

module.exports.like = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Like the selected media.
      await client.media.like({
        mediaId: req.body.mediaId,
        moduleInfo: {
          module_name: 'profile',
          user_id: client.state.cookieUserId,
          username: req.cookies.seed,
        }
      });
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.save = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Save the selected media.
      await client.media.save(req.body.mediaId);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.seen = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Load the state from a previous session.
    await client.state.deserialize(req.body.session);
    // Mark selected stories as seen.
    await client.story.seen(req.body.stories);
    res.status(200);
    res.send();
  })();
};

module.exports.unlike = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Unlike the selected media.
      await client.media.unlike({
        mediaId: req.body.mediaId,
        moduleInfo: {
          module_name: 'profile',
          user_id: client.state.cookieUserId,
          username: req.cookies.seed,
        }
      });
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.unsave = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Unsave the selected media.
      await client.media.unsave(req.body.mediaId);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.video = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Load cookies to local object.
      let c = await client.state.serializeCookieJar();
      let cookies = {
        csrftoken: c.cookies.find(o => o.key == 'csrftoken').value,
        mid: c.cookies.find(o => o.key == 'mid').value,
        rur: c.cookies.find(o => o.key == 'rur').value,
        ds_user_id: c.cookies.find(o => o.key == 'ds_user_id').value,
        sessionid: c.cookies.find(o => o.key == 'sessionid').value,
        shbid: c.cookies.find(o => o.key == 'shbid').value,
        shbts: c.cookies.find(o => o.key == 'shbts').value,
      };
      // Fetch user GraphQL info, which includes the media (Video/IGTV) object.
      const mediaVideo = await (await fetch(`https://www.instagram.com/tv/${req.body.id}/?__a=1&__d=dis`, {
        mode: 'GET', headers: {
          'cookie': `csrftoken=${cookies.csrftoken}; mid=${cookies.mid}; rur=${cookies.rur}; ds_user_id=${cookies.ds_user_id}; sessionid=${cookies.sessionid}; shbid=${cookies.shbid}; shbts=${cookies.shbts}`
        }
      })).json();
      // Create custom object to return data.
      mediaVideo.items[0].instagular = {};
      mediaVideo.items[0].instagular.media_type = [3];
      mediaVideo.items[0].instagular.thumb = [mediaVideo.items[0].image_versions2.candidates[0].url];
      mediaVideo.items[0].instagular.full = [mediaVideo.items[0].video_versions[0].url];
      // Return user channel feed.
      res.status(200);
      res.json(mediaVideo.items[0]);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};