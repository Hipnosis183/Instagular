const { IgApiClient } = require('instagram-private-api');

module.exports.highlightsTray = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Load the state from a previous session.
    await client.state.deserialize(req.body.session);
    // Set the user id.
    const userId = req.body.id ? await req.body.id : client.state.cookieUserId;
    // Load highlights feed object.
    const feedReels = await client.highlights.highlightsTray(userId);
    // Return highlights objects.
    res.json(feedReels.tray);
  })();
};