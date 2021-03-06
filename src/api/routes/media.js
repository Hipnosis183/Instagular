const { IgApiClient: Client } = require('instagram-private-api');

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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Like the selected media.
      await client.media.like({ mediaId: req.body.mediaId, moduleInfo: { module_name: 'profile' } });
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.likes_hide = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Hide the like and view counts for the selected media.
      await client.media.likeVisibilityUpdate(req.body.id, true);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.likes_unhide = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Unhide the like and view counts for the selected media.
      await client.media.likeVisibilityUpdate(req.body.id, false);
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Save the selected media.
      await client.media.save(req.body.mediaId, req.body.collectionId ? [req.body.collectionId] : []);
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Mark selected stories as seen.
      await client.story.seen(req.body.stories);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.unlike = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Unlike the selected media.
      await client.media.unlike({ mediaId: req.body.mediaId, moduleInfo: { module_name: 'profile' } });
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Unsave the selected media.
      await client.media.unsave(req.body.mediaId, req.body.collectionId ? [req.body.collectionId] : null);
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Get Video/IGTV media object information.
      const mediaVideo = await client.video.info(req.body.id);
      // Create custom object to return data.
      mediaVideo.instagular = {};
      mediaVideo.instagular.media_type = [3];
      mediaVideo.instagular.thumb = [mediaVideo.image_versions2.candidates[0].url];
      mediaVideo.instagular.full = [mediaVideo.video_versions[0].url];
      // Return media object information.
      res.status(200);
      res.json(mediaVideo);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};