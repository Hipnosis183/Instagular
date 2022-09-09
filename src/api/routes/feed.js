const { IgApiClient: Client } = require('instagram-private-api');

module.exports.comments = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load comments feed object.
      const feedComments = client.feed.mediaComments(req.body.id);
      // Load the state of the feed if present.
      if (req.body.feed) { feedComments.deserialize(req.body.feed); }
      // Get comments from the feed object.
      const comments = await feedComments.items();
      // Return comments feed list and state.
      res.status(200);
      res.json({ feed: feedComments.serialize(), comments: comments });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.comments_replies = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load replies feed object.
      const feedReplies = client.feed.mediaCommentsChild(req.body.mediaId, req.body.commentId);
      // Load the state of the feed if present.
      if (req.body.feed) { feedReplies.deserialize(req.body.feed); }
      // Get replies from the feed object.
      const replies = await feedReplies.items();
      // Return replies feed list and state.
      res.status(200);
      res.json({ feed: feedReplies.serialize(), replies: replies });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.followers_mutual = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      const userId = req.body.id ? req.body.id : client.state.cookieUserId;
      // Get user mutual followers information.
      const mutualsFeed = client.feed.accountFollowersMutual(userId);
      // Load the state of the feed if present.
      if (req.body.feed) { mutualsFeed.deserialize(req.body.feed); }
      // Load user mutual followers. Feeds are auto paginated.
      let mutuals = !req.body.feed || mutualsFeed.isMoreAvailable() ? await mutualsFeed.items() : {};
      let mutualsIds = mutuals.map((res) => { return res.pk; });
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Load mutual followers friendship status, since it's not included in the previous call.
      await client.friendship.showMany(mutualsIds).then((data) => {
        for (let i = 0; i < mutuals.length; i++) {
          mutuals[i].friendship = data[mutuals[i].pk];
        }
      });
      // Return user mutual followers information.
      res.status(200);
      res.json({ feed: mutualsFeed.serialize(), mutuals: mutuals });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.followers = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      const userId = req.body.id ? req.body.id : client.state.cookieUserId;
      // Get user followers information.
      const followersFeed = client.feed.accountFollowers({ id: userId, count: 24 });
      // Load the state of the feed if present.
      if (req.body.feed) { followersFeed.deserialize(req.body.feed); }
      // Load user followers. Feeds are auto paginated.
      let followers = !req.body.feed || followersFeed.isMoreAvailable() ? await followersFeed.items() : {};
      let followersIds = followers.map((res) => { return res.pk; });
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Load followers friendship status, since it's not included in the previous call.
      await client.friendship.showMany(followersIds).then((data) => {
        for (let i = 0; i < followers.length; i++) {
          followers[i].friendship = data[followers[i].pk];
        }
      });
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
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      const userId = req.body.id ? req.body.id : client.state.cookieUserId;
      // Get user following information.
      const followingFeed = client.feed.accountFollowing({ id: userId, count: 24 });
      // Load the state of the feed if present.
      if (req.body.feed) { followingFeed.deserialize(req.body.feed); }
      // Load user following. Feeds are auto paginated.
      let following = !req.body.feed || followingFeed.isMoreAvailable() ? await followingFeed.items() : {};
      let followingIds = following.map((res) => { return res.pk; });
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Load following friendship status, since it's not included in the previous call.
      await client.friendship.showMany(followingIds).then((data) => {
        for (let i = 0; i < following.length; i++) {
          following[i].friendship = data[following[i].pk];
        }
      });
      // Return user following information.
      res.status(200);
      res.json({ feed: followingFeed.serialize(), following: following });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.reels = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load clips feed object.
      const feedClips = client.feed.clips(req.body.id, req.body.cursor ? req.body.cursor : '');
      // Initialize reels feed list.
      let cursor, reels = [];
      // Load clips in batches of 24 items. Feeds must be paginated manually.
      await feedClips.items().then((res) => {
        // Get feed cursor position.
        cursor = res.cursor ? res.cursor : '';
        // Get media data from urls.
        res.items.forEach(async (clip) => {
          // Process clip custom data.
          clip.media.instagular = await postInfo(clip.media)
          // Add clip to reels list.
          reels.push(clip.media);
        });
      });
      // Return clips object.
      res.status(200);
      res.json({ cursor: cursor, posts: reels });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.reelsMedia = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load selected users reels media.
      const feedReels = client.feed.reelsMedia({ userIds: req.body.stories });
      // Load users stories.
      let stories = await feedReels.request();
      // Return stories objects.
      res.status(200);
      res.json(stories.reels);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.reelsTray = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load reels feed object.
      const feedReels = client.feed.reelsTray();
      // Load most recent stories. Feeds are auto paginated.
      let stories = await feedReels.items();
      // Return stories objects.
      res.status(200);
      res.json(stories);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.saved = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load collections feed object.
      const feedCollections = client.feed.collections();
      // Get collections list from the feed object.
      const collections = await feedCollections.items();
      // Return collections feed list and state.
      res.status(200);
      res.json({ feed: feedCollections.serialize(), collections: collections });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.saved_all = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load all saved posts feed object.
      const feedSaved = client.feed.saved();
      // Load the state of the feed if present.
      if (req.body.feed) { feedSaved.deserialize(req.body.feed); }
      // Initialize saved posts feed list.
      let posts = [];
      // Load all posts saved by the user. Feeds are auto paginated.
      await feedSaved.items().then((res) => {
        // Get media data from urls.
        res.forEach(async (post) => {
          // Process post custom data.
          post.instagular = await postInfo(post)
          // Add post to feed list.
          posts.push(post);
        });
      });
      // Return saved posts feed list and state.
      res.status(200);
      res.json({ feed: feedSaved.serialize(), posts: posts });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.saved_collection = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load collection feed object.
      const feedCollection = client.feed.collection(req.body.id);
      // Load the state of the feed if present.
      if (req.body.feed) { feedCollection.deserialize(req.body.feed); }
      // Initialize collection posts feed list.
      let posts = [];
      // Load all posts for the collection made by the user. Feeds are auto paginated.
      await feedCollection.items().then((res) => {
        // Get media data from urls.
        res.forEach(async (post) => {
          // Process post custom data.
          post.instagular = await postInfo(post)
          // Add post to feed list.
          posts.push(post);
        });
      });
      // Return collection posts feed list and state.
      res.status(200);
      res.json({ feed: feedCollection.serialize(), posts: posts });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.tagged = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load tagged feed object.
      const feedTagged = client.feed.usertags(req.body.id);
      // Load the state of the feed if present.
      if (req.body.feed) { feedTagged.deserialize(req.body.feed); }
      // Initialize tagged feed posts list.
      let posts = [];
      // Load most recent user tagged posts. Feeds are auto paginated.
      if (!req.body.feed || feedTagged.isMoreAvailable()) {
        await feedTagged.items().then((res) => {
          // Get media data from urls.
          res.forEach(async (post) => {
            // Process post custom data.
            post.instagular = await postInfo(post)
            // Add post to feed list.
            posts.push(post);
          });
        });
      }
      // Return tagged feed posts list and state.
      res.status(200);
      res.json({ feed: feedTagged.serialize(), posts: posts });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.timeline = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
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
          await feedTimeline.items().then((res) => {
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
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      // Return timeline feed posts list and state.
      res.status(200);
      res.json({ feed: feedTimeline.serialize(), posts: posts });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.user = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      const userId = req.body.id ? await client.user.getIdByUsername(req.body.id) : client.state.cookieUserId;
      // Load user feed object.
      const feedUser = client.feed.user(userId);
      // Load the state of the feed if present.
      if (req.body.feed) { feedUser.deserialize(req.body.feed); }
      // Initialize feed posts list.
      let posts = [];
      // Load most recent user posts. Feeds are auto paginated.
      if (!req.body.feed || feedUser.isMoreAvailable()) {
        await feedUser.items().then((res) => {
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
      res.status(200);
      res.json({ feed: feedUser.serialize(), posts: posts });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.video = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Load Video/IGTV feed object.
      const feedVideo = client.feed.video(req.body.id);
      // Load the state of the feed if present.
      if (req.body.feed) { feedVideo.deserialize(req.body.feed); }
      // Get posts list from the feed object.
      const posts = await feedVideo.items();
      // Return user channel feed posts list and state.
      res.status(200);
      res.json({ feed: feedVideo.serialize(), posts: posts });
    } catch (e) {
      res.status(400);
      res.send(e);
    }
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