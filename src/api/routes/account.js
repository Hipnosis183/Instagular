const { IgApiClient: Client } = require('instagram-private-api');

module.exports.login = (req, res, next) => {
  ; (async () => {
    // Create client instance and generate fake device information.
    const client = new Client();
    client.state.generateDevice(req.body.username);
    // Initialize login flow.
    await client.simulate.preLoginFlow();
    try {
      // Log in with the given credentials.
      await client.account.login(req.body.username, req.body.password);
      process.nextTick(async () => {
        // Finish the login process.
        await client.simulate.postLoginFlow();
        // Serialize the client state.
        const serialized = await client.state.serialize();
        // Remove unnecessary information from the state.
        delete serialized.constants;
        delete serialized.supportedCapabilities;
        // Return serialized client state.
        res.status(200);
        res.json(serialized);
      });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.logout = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Log out of the current user session.
      await client.account.logout();
      process.nextTick(async () => {
        res.status(200);
        res.send();
      });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};