const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const { IgApiClient } = require('instagram-private-api');

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
    // Load the state of the feed if present.
    if (req.body.feed) { feedTimeline.deserialize(req.body.feed); }
    // Initialize feed posts list.
    let posts = [];
    // Load most recent posts. Feeds are auto paginated.
    let index = req.body.feed ? 1 : 3;
    for (let i = 0; i < index; i++) {
      if ((!req.body.feed && i == 0) || feedTimeline.isMoreAvailable()) {
        await feedTimeline.items()
          .then((res) => {
            // Get media data from urls.
            res.forEach(async (post) => {
              // Exclude ads processing.
              if (post.product_type != 'ad') {
                // Process post custom data.
                post.instagular = await getPostInfo(post)
                // Add post to feed list.
                posts.push(post);
              }
            });
          });
      }
      // Wait 2 seconds for the next API request to avoid blocks.
      if ((i + 1) != index) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    // Return timeline feed posts list and state.
    res.json({ feed: feedTimeline.serialize(), posts: posts });
  })();
});

router.post('/user', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Load the state from a previous session.
    await client.state.deserialize(req.body.session);
    // Set the user id.
    const userId = req.body.id ? await client.user.getIdByUsername(req.body.id) : client.state.cookieUserId;
    // Load user feed object.
    const feedUser = client.feed.user(userId);
    // Load the state of the feed if present.
    if (req.body.feed) { feedUser.deserialize(req.body.feed); }
    // Initialize feed posts list.
    let posts = [];
    // Load most recent user posts. Feeds are auto paginated.
    if (!req.body.feed || feedUser.isMoreAvailable()) {
      await feedUser.items()
        .then((res) => {
          // Get media data from urls.
          res.forEach(async (post) => {
            // Process post custom data.
            post.instagular = await getPostInfo(post)
            // Add post to feed list.
            posts.push(post);
          });
        });
    }
    // Return user feed posts list and state.
    res.json({ feed: feedUser.serialize(), posts: posts });
  })();
});

const getPostInfo = async (post) => {
  // Create custom object to return data.
  let instagular = {};
  // Download URL Flags (Required):
  // -'_nc_ht': ? (Signature mismatch)
  // -'_nc_ohc': ? (Signature mismatch)
  // -'edm': ? (Signature mismatch)
  // -'oh': Hash
  // -'oe': Timestamp
  //
  // Download URL Flags (Optional):
  // -'se': Image quality (0-9)
  //
  // Append '&se=0' to ensure always source quality.
  // Append '&dl=1' to download media automatically.
  instagular.download = [];
  instagular.full = [];
  instagular.media_type = [];
  instagular.thumb = [];
  // Get profile picture image.
  instagular.profile = post.user.profile_pic_url;
  // Parse different media types data.
  switch (post.media_type) {
    case 1: {
      instagular.media_type.push(1);
      let thumb = post.image_versions2.candidates[1].url;
      instagular.thumb.push(thumb);
      let full = post.image_versions2.candidates[0].url;
      instagular.full.push(full);
      let download = post.image_versions2.candidates[0].url + '&se=0&dl=1';
      instagular.download.push(download);
      break;
    }
    case 2: {
      instagular.media_type.push(2);
      let thumb = post.image_versions2.candidates[0].url;
      instagular.thumb.push(thumb);
      let full = post.video_versions[0].url;
      instagular.full.push(full);
      let download = post.video_versions[0].url + '&se=0&dl=1';
      instagular.download.push(download);
      break;
    }
    case 8: {
      for (let media of post.carousel_media) {
        switch (media.media_type) {
          case 1: {
            instagular.media_type.push(1);
            let thumb = media.image_versions2.candidates[1].url;
            instagular.thumb.push(thumb);
            let full = media.image_versions2.candidates[0].url;
            instagular.full.push(full);
            let download = media.image_versions2.candidates[0].url + '&se=0&dl=1';
            instagular.download.push(download);
            break;
          }
          case 2: {
            instagular.media_type.push(2);
            let thumb = media.image_versions2.candidates[0].url;
            instagular.thumb.push(thumb);
            let full = media.video_versions[0].url;
            instagular.full.push(full);
            let download = media.video_versions[0].url + '&se=0&dl=1';
            instagular.download.push(download);
            break;
          }
        }
      }
      break;
    }
  }
  // Return processed post response.
  return instagular;
}

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

router.post('/follow', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Follow the selected user.
      await client.friendship.create(req.body.userId);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/unfollow', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Unfollow the selected user.
      await client.friendship.destroy(req.body.userId);
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
      // Set the user id.
      const userId = req.body.id ? await client.user.getIdByUsername(req.body.id) : client.state.cookieUserId;
      // Get current user profile information.
      let userProfile = await client.user.info(userId);
      // Create custom object to return data.
      userProfile.instagular = {}
      // Get thumbnail image.
      userProfile.instagular.thumb = userProfile.hd_profile_pic_url_info.url;
      // Get relationship data with the current user.
      userProfile.friendship = await client.friendship.show(userId);
      // Return user profile information.
      res.status(200);
      res.send(JSON.stringify(userProfile));
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/followers', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Set the user id.
      const userId = req.body.id ? await client.user.getIdByUsername(req.body.id) : client.state.cookieUserId;
      // Get user followers information.
      const followersFeed = client.feed.accountFollowers(userId);
      // Load the state of the feed if present.
      if (req.body.feed) { followersFeed.deserialize(req.body.feed); }
      // Load user followers. Feeds are auto paginated.
      let followers = !req.body.feed || followersFeed.isMoreAvailable() ? await followersFeed.items() : {};
      // Return user followers information.
      res.status(200);
      res.json({ feed: followersFeed.serialize(), followers: followers });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/following', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Set the user id.
      const userId = req.body.id ? await client.user.getIdByUsername(req.body.id) : client.state.cookieUserId;
      // Get user following information.
      const followingFeed = client.feed.accountFollowing(userId);
      // Load the state of the feed if present.
      if (req.body.feed) { followingFeed.deserialize(req.body.feed); }
      // Load user following. Feeds are auto paginated.
      let following = !req.body.feed || followingFeed.isMoreAvailable() ? await followingFeed.items() : {};
      // Return user following information.
      res.status(200);
      res.json({ feed: followingFeed.serialize(), following: following });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/search', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Get user following information.
      const searchResults = await client.search.users(req.body.query);
      // Return user following information.
      res.status(200);
      res.json(searchResults);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/encode', (req, res, next) => {
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
});

module.exports = router;