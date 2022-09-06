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

module.exports.removeFollower = (req, res, next) => {
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

module.exports.setBesties = (req, res, next) => {
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

module.exports.updateFeedFavorites = (req, res, next) => {
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