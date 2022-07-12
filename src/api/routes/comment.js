const { IgApiClient: Client } = require('instagram-private-api');

module.exports.create = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Check to avoid the comment being treated as spam.
      await client.media.checkOffensiveComment(req.body.text, req.body.mediaId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Comment on the selected media.
      const comment = await client.media.comment({ mediaId: req.body.mediaId, text: req.body.text, replyToCommentId: req.body.reply });
      res.status(200);
      res.json(comment);
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.delete = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Delete selected comment.
      await client.media.commentDelete(req.body.mediaId, req.body.commentId);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.like = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Like the selected comment.
      await client.media.likeComment(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.unlike = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Unike the selected comment.
      await client.media.unlikeComment(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.comments_enable = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Enable comments for the selected media.
      await client.media.commentsEnable(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};

module.exports.comments_disable = (req, res, next) => {
  ; (async () => {
    // Create client instance an load session state.
    const client = new Client();
    await client.state.deserialize(req.body.session);
    try {
      // Disable comments for the selected media.
      await client.media.commentsDisable(req.body.id);
      res.status(200);
      res.send();
    } catch (e) {
      res.status(400);
      res.send(e);
    }
  })();
};