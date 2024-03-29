const { IgApiClient: Client } = require('instagram-private-api');

module.exports.block = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Block the selected user.
      await client.friendship.block(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.favorite = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      switch (req.body.option) {
        case 'posts': {
          // Enable posts notifications for the selected user.
          await client.friendship.favorite(req.body.id); break;
        }
        case 'stories': {
          // Enable stories notifications for the selected user.
          await client.friendship.favoriteStories(req.body.id); break;
        }
        case 'videos': {
          // Enable videos notifications for the selected user.
          await client.friendship.favoriteIgtv(req.body.id); break;
        }
        case 'reels': {
          // Enable reels notifications for the selected user.
          await client.friendship.favoriteClips(req.body.id); break;
        }
      }
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.follow = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Follow the selected user.
      await client.friendship.create(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.mute = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Mute the selected user.
      await client.friendship.mutePostsOrStoryFromFollow({ mediaId: null, targetReelAuthorId: req.body.reel, targetPostsAuthorId: req.body.post });
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.remove_follower = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Remove the selected user from followers.
      await client.friendship.removeFollower(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.set_besties = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Set user besties/close friends.
      await client.friendship.setBesties({ add: req.body.add, remove: req.body.remove });
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.unblock = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Unblock the selected user.
      await client.friendship.unblock(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.unfavorite = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      switch (req.body.option) {
        case 'posts': {
          // Disable posts notifications for the selected user.
          await client.friendship.unfavorite(req.body.id); break;
        }
        case 'stories': {
          // Disable stories notifications for the selected user.
          await client.friendship.unfavoriteStories(req.body.id); break;
        }
        case 'videos': {
          // Disable videos notifications for the selected user.
          await client.friendship.unfavoriteIgtv(req.body.id); break;
        }
        case 'reels': {
          // Disable reels notifications for the selected user.
          await client.friendship.unfavoriteClips(req.body.id); break;
        }
      }
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
      await client.friendship.destroy(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.unmute = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Unmute the selected user.
      await client.friendship.unmutePostsOrStoryFromFollow({ targetReelAuthorId: req.body.reel, targetPostsAuthorId: req.body.post });
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.update_feed_favorites = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Update user favorite accounts.
      await client.friendship.updateFeedFavorites({ add: req.body.add, remove: req.body.remove });
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};