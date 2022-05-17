const { IgApiClient } = require('instagram-private-api');

module.exports.follow = (req, res, next) => {
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
};

module.exports.unfollow = (req, res, next) => {
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
};

module.exports.followers = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Set the user id.
      const userId = req.body.id ? req.body.id : client.state.cookieUserId;
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
};

module.exports.following = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Set the user id.
      const userId = req.body.id ? req.body.id : client.state.cookieUserId;
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
};

module.exports.search = (req, res, next) => {
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
};

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