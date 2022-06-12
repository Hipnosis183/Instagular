const { IgApiClient: Client } = require('instagram-private-api');

module.exports.highlightsTray = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      const userId = req.body.id ? await req.body.id : client.state.cookieUserId;
      // Load highlights feed object.
      const feedReels = await client.highlights.highlightsTray(userId);
      // Return highlights objects.
      res.status(200);
      res.json(feedReels.tray);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};