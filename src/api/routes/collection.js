const { IgApiClient } = require('instagram-private-api');

module.exports.create = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Create collection with the given information.
      await client.collections.create(req.body.name, req.body.medias);
      // Return request status.
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.edit = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Edit collection with the given information.
      await client.collections.edit(req.body.id, req.body.name, req.body.add, req.body.remove);
      // Return request status.
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};