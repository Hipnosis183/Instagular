const { IgApiClient } = require('instagram-private-api');

module.exports.followers = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Set the user id.
      const userId = req.body.id ? req.body.id : client.state.cookieUserId;
      // Get user followers information.
      const followersFeed = client.feed.accountFollowers(userId);
      // Load the state of the feed if present.
      if (req.body.feed) { followersFeed.deserialize(req.body.feed); }
      // Load user followers. Feeds are auto paginated.
      let followers = !req.body.feed || followersFeed.isMoreAvailable() ? await followersFeed.items() : {};
      // Return user followers information.
      res.status(200);
      res.json({ feed: followersFeed.serialize(), followers: followers });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.following = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    try {
      // Load the state from a previous session.
      await client.state.deserialize(req.body.session);
      // Set the user id.
      const userId = req.body.id ? req.body.id : client.state.cookieUserId;
      // Get user following information.
      const followingFeed = client.feed.accountFollowing(userId);
      // Load the state of the feed if present.
      if (req.body.feed) { followingFeed.deserialize(req.body.feed); }
      // Load user following. Feeds are auto paginated.
      let following = !req.body.feed || followingFeed.isMoreAvailable() ? await followingFeed.items() : {};
      // Return user following information.
      res.status(200);
      res.json({ feed: followingFeed.serialize(), following: following });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.reelsMedia = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Load the state from a previous session.
    await client.state.deserialize(req.body.session);
    // Load selected users reels media.
    const feedReels = client.feed.reelsMedia({ userIds: req.body.stories });
    // Load users stories.
    let stories = await feedReels.request();
    // Return stories objects.
    res.json(stories.reels);
  })();
};

module.exports.reelsTray = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Load the state from a previous session.
    await client.state.deserialize(req.body.session);
    // Load reels feed object.
    const feedReels = client.feed.reelsTray();
    // Load most recent stories. Feeds are auto paginated.
    let stories = await feedReels.items();
    // Return stories objects.
    res.json(stories);
  })();
};

module.exports.timeline = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Load the state from a previous session.
    await client.state.deserialize(req.body.session);
    // Load timeline feed object.
    const feedTimeline = client.feed.timeline();
    // Load the state of the feed if present.
    if (req.body.feed) { feedTimeline.deserialize(req.body.feed); }
    // Initialize feed posts list.
    let posts = [];
    // Load most recent posts. Feeds are auto paginated.
    let index = req.body.feed ? 1 : 3;
    for (let i = 0; i < index; i++) {
      if ((!req.body.feed && i == 0) || feedTimeline.isMoreAvailable()) {
        await feedTimeline.items()
          .then((res) => {
            // Get media data from urls.
            res.forEach(async (post) => {
              // Exclude ads processing.
              if (post.product_type != 'ad') {
                // Process post custom data.
                post.instagular = await postInfo(post)
                // Add post to feed list.
                posts.push(post);
              }
            });
          });
      }
      // Wait 2 seconds for the next API request to avoid blocks.
      if ((i + 1) != index) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    // Return timeline feed posts list and state.
    res.json({ feed: feedTimeline.serialize(), posts: posts });
  })();
};

module.exports.user = (req, res, next) => {
  ; (async () => {
    // Create new Instagram client instance.
    const client = new IgApiClient();
    // Generate fake device information based on seed.
    client.state.generateDevice(req.cookies.seed);
    // Load the state from a previous session.
    await client.state.deserialize(req.body.session);
    // Set the user id.
    const userId = req.body.id ? await client.user.getIdByUsername(req.body.id) : client.state.cookieUserId;
    // Load user feed object.
    const feedUser = client.feed.user(userId);
    // Load the state of the feed if present.
    if (req.body.feed) { feedUser.deserialize(req.body.feed); }
    // Initialize feed posts list.
    let posts = [];
    // Load most recent user posts. Feeds are auto paginated.
    if (!req.body.feed || feedUser.isMoreAvailable()) {
      await feedUser.items()
        .then((res) => {
          // Get media data from urls.
          res.forEach(async (post) => {
            // Process post custom data.
            post.instagular = await postInfo(post)
            // Add post to feed list.
            posts.push(post);
          });
        });
    }
    // Return user feed posts list and state.
    res.json({ feed: feedUser.serialize(), posts: posts });
  })();
};

const postInfo = async (post) => {
  // Create custom object to return data.
  let instagular = {
    media_type: [],
    thumb: [],
    full: []
  };
  // Parse different media types data.
  switch (post.media_type) {
    case 1: {
      instagular.media_type.push(1);
      instagular.thumb.push(post.image_versions2.candidates[1].url);
      instagular.full.push(post.image_versions2.candidates[0].url);
      break;
    }
    case 2: {
      instagular.media_type.push(2);
      instagular.thumb.push(post.image_versions2.candidates[0].url);
      instagular.full.push(post.video_versions[0].url);
      break;
    }
    case 8: {
      for (let media of post.carousel_media) {
        switch (media.media_type) {
          case 1: {
            instagular.media_type.push(1);
            instagular.thumb.push(media.image_versions2.candidates[1].url);
            instagular.full.push(media.image_versions2.candidates[0].url);
            break;
          }
          case 2: {
            instagular.media_type.push(2);
            instagular.thumb.push(media.image_versions2.candidates[0].url);
            instagular.full.push(media.video_versions[0].url);
            break;
          }
        }
      } break;
    }
  }
  // Return processed post response.
  return instagular;
}