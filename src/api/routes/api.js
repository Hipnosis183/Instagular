const express = require('express');
const router = express.Router();

const { IgApiClient } = require('instagram-private-api')

router.post('/login', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.body.username);
    // Initialize login flow.
    await client.simulate.preLoginFlow();
    try {
      // Try to log in with the given credentials.
      await client.account.login(req.body.username, req.body.password);
      process.nextTick(async () => {
        // Finish the login process.
        await client.simulate.postLoginFlow();
        // Serialize the client state.
        const serialized = await client.state.serialize();
        // Remove unnecessary information from the state.
        delete serialized.constants;
        delete serialized.supportedCapabilities;
        // Store username to keep the seed consistent and unique.
        res.cookie('seed', req.body.username);
        res.status(200);
        // Return serialized client state.
        res.send(JSON.stringify(serialized));
      });
    } catch (e) {
      // If login fails.
      res.clearCookie('seed');
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/logout', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Try to log out the current user session.
      await client.account.logout();
      process.nextTick(async () => {
        // Clear stored username seed.
        res.clearCookie('seed');
        res.status(200);
        res.send();
      });
    } catch (e) {
      // If logout fails.
      res.status(400);
      res.send(e);
    }
  })();
});

router.post('/session', (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Initialize login flow.
    await client.simulate.preLoginFlow();
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      process.nextTick(async () => {
        // Finish the login process.
        await client.simulate.postLoginFlow();
        // Serialize the client state.
        const serialized = await client.state.serialize();
        // Remove unnecessary information from the state.
        delete serialized.constants;
        delete serialized.supportedCapabilities;
        // Store username to keep the seed consistent and unique.
        res.cookie('seed', req.cookies.seed);
        res.status(200);
        // Return serialized client state.
        res.send(JSON.stringify(serialized));
      });
    } catch (e) {
      // If session loading fails.
      res.clearCookie('seed');
      res.status(400);
      res.send(e);
    }
  })();
});

module.exports = router;