const { IgApiClient: Client } = require('instagram-private-api');

module.exports.create = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Create collection with the given information.
      const collection = await client.collections.create(req.body.name, req.body.medias);
      res.status(200);
      res.json(collection);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.delete = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Delete selected collection.
      await client.collections.delete(req.body.id);
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Edit collection with the given information.
      await client.collections.edit(req.body.id, req.body.name, req.body.add, req.body.remove);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};