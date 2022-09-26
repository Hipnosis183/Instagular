const { IgApiClient: Client } = require('instagram-private-api');

module.exports.set_subscription_preference = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Set live broadcast notifications for the selected user.
      await client.live.setSubscriptionPreference(req.body.id, req.body.option);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};