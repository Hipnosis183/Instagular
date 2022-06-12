const { IgApiClient: Client } = require('instagram-private-api');

module.exports.profile = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      const userId = req.body.id ? await client.user.getIdByUsername(req.body.id) : client.state.cookieUserId;
      // Get current user profile information.
      let userProfile = await client.user.info(userId);
      // Get relationship data with the current user.
      userProfile.friendship = await client.friendship.show(userId);
      if (req.body.stories) {
        // Load selected user reels media.
        const feedReels = client.feed.reelsMedia({ userIds: [userId] });
        userProfile.reels = Object.values((await feedReels.request()).reels)[0];
        // Search for stories and set bestie status.
        if (userProfile.reels) {
          for (let reel of userProfile.reels.items) {
            if (reel.audience == 'besties') {
              userProfile.reels.has_besties_media = true;
            }
          }
        }
      }
      // Return user profile information.
      res.status(200);
      res.json(userProfile);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};