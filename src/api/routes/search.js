const { IgApiClient } = require('instagram-private-api');

module.exports.users = (req, res, next) => {
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