const { IgApiClient: Client } = require('instagram-private-api');

module.exports.recent = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Search for the user recent searches.
      const searchResults = await client.search.recent();
      // Filter users (temporary).
      let searchResultsUser = searchResults.filter((res) => res.user);
      searchResultsUser = searchResultsUser.map((res) => res.user);
      // Return recent searches results.
      res.status(200);
      res.json(searchResultsUser);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.recent_clear = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Clear all user recent searches.
      await client.fbsearch.clearSearchHistory();
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.recent_hide = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Hide selected item from recent searches.
      await client.fbsearch.hideSearchEntities({ user: req.body.user });
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.recent_register = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Register the selected user to the recent searches.
      await client.fbsearch.registerRecentSearch(req.body.id, 'user');
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

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