const { IgApiClient: Client } = require('instagram-private-api');

module.exports.follow = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
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