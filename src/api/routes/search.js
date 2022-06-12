const { IgApiClient: Client } = require('instagram-private-api');

module.exports.users = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Make a users search with the given string.
      const searchResults = await client.search.users(req.body.query);
      // Return search results.
      res.status(200);
      res.json(searchResults);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};