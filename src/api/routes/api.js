const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const { IgApiClient } = require('instagram-private-api')

router.post('/login', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.body.username);
    // Initialize login flow.
    await client.simulate.preLoginFlow();
    try {
      // Try to log in with the given credentials.
      await client.account.login(req.body.username, req.body.password);
      process.nextTick(async () => {
        // Finish the login process.
        await client.simulate.postLoginFlow();
        // Serialize the client state.
        const serialized = await client.state.serialize();
        // Remove unnecessary information from the state.
        delete serialized.constants;
        delete serialized.supportedCapabilities;
        // Store username to keep the seed consistent and unique.
        res.cookie('pk', client.state.cookieUserId);
        res.cookie('seed', req.body.username);
        res.status(200);
        // Return serialized client state.
        res.send(JSON.stringify(serialized));
      });
    } catch (e) {
      // If login fails.
      res.clearCookie('pk');
      res.clearCookie('seed');
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/logout', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Try to log out the current user session.
      await client.account.logout();
      process.nextTick(async () => {
        // Clear stored username seed.
        res.clearCookie('pk');
        res.clearCookie('seed');
        res.status(200);
        res.send();
      });
    } catch (e) {
      // If logout fails.
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/session', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Initialize login flow.
    await client.simulate.preLoginFlow();
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      process.nextTick(async () => {
        // Finish the login process.
        await client.simulate.postLoginFlow();
        // Serialize the client state.
        const serialized = await client.state.serialize();
        // Remove unnecessary information from the state.
        delete serialized.constants;
        delete serialized.supportedCapabilities;
        // Store username to keep the seed consistent and unique.
        res.cookie('pk', client.state.cookieUserId);
        res.cookie('seed', req.cookies.seed);
        res.status(200);
        // Return serialized client state.
        res.send(JSON.stringify(serialized));
      });
    } catch (e) {
      // If session loading fails.
      res.clearCookie('pk');
      res.clearCookie('seed');
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/feed', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Load the state from a previous session.
    await client.state.deserialize(req.body.session);
    // Load timeline feed object.
    const feedTimeline = client.feed.timeline();
    // Initialize feed elements list.
    let items = [];
    let ad = 0;
    // Load last couple of posts (25 average without ads).
    // Feeds are auto paginated, in a weird way.
    for (let i = 0; i < 4; i++) {
      await feedTimeline.items()
        .then(async (res) => {
          // Get media data from urls.
          res.forEach(async (post) => {
            // Exclude ads processing.
            if (post.product_type != 'ad') {
              // Create custom object to store data.
              let instagram = {
                profile: null,
                thumb: null
              };
              // Parse different media types data.
              switch (post.product_type) {
                case 'feed': {
                  // Set thumbnail image url.
                  instagram.thumb = post.image_versions2.candidates[1].url;
                  break;
                }
                case 'clips':
                case 'igtv': {
                  // Set thumbnail image url.
                  instagram.thumb = post.image_versions2.candidates[0].url;
                  break;
                }
                case 'carousel_container': {
                  // Set thumbnail image url.
                  instagram.thumb = post.carousel_media[0].image_versions2.candidates[1].url;
                  break;
                }
              }
              // Create custom object to return data.
              post.instagram = {}
              // Get profile picture image.
              post.instagram.profile = await getBase64Image(post.user.profile_pic_url);
              // Get thumbnail image.
              post.instagram.thumb = await getBase64Image(instagram.thumb);
              // Add post to feed list.
              items.push(post);
            }
          });
        });
    }
    // Return feed elements list.
    res.json(items);
  })();
});

router.post('/like', (req, res, next) => {
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
});

router.post('/unlike', (req, res, next) => {
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
});

router.post('/profile', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Get current user profile information.
      let userProfile = await client.user.info(client.state.cookieUserId);
      // Create custom object to return data.
      userProfile.instagram = {}
      // Get thumbnail image.
      userProfile.instagram.thumb = await getBase64Image(userProfile.profile_pic_url);
      // Return user profile information.
      res.status(200);
      res.send(JSON.stringify(userProfile));
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
});

async function getBase64Image(url) {
  // Create URL object to get the hostname.
  const host = new URL(url);
  // Fetch image data from url.
  const body = await fetch(url, { mode: 'GET', headers: { Host: host.hostname } });
  // Convert image to blob.
  let blob = await body.blob()
    .then(async (res) => {
      // Get actual image binary data.
      return await res.arrayBuffer();
    });
  // Convert blob data to Base64.
  let bufferBase64 = Buffer.from(blob, 'binary').toString('base64');
  // Return formatted data to use as an image.
  return 'data:image/png;base64,' + bufferBase64;
}

module.exports = router;