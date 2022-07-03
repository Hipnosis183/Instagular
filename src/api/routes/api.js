const express = require('express');
const router = express.Router();

// Account route endpoints.
const account = require('./account');
router.post('/account/login', account.login);
router.post('/account/logout', account.logout);

// Collection route endpoints.
const collection = require('./collection');
router.post('/collection/create', collection.create);
router.post('/collection/delete', collection.delete);
router.post('/collection/edit', collection.edit);

// Feed route endpoints.
const feed = require('./feed');
router.post('/feed/comments', feed.comments);
router.post('/feed/comments_replies', feed.comments_replies);
router.post('/feed/followers', feed.followers);
router.post('/feed/following', feed.following);
router.post('/feed/reels', feed.reels);
router.post('/feed/reels_media', feed.reelsMedia);
router.post('/feed/reels_tray', feed.reelsTray);
router.post('/feed/saved', feed.saved);
router.post('/feed/saved_all', feed.saved_all);
router.post('/feed/saved_collection', feed.saved_collection);
router.post('/feed/tagged', feed.tagged);
router.post('/feed/timeline', feed.timeline);
router.post('/feed/user', feed.user);
router.post('/feed/video', feed.video);

// Friendship route endpoints.
const friendship = require('./friendship');
router.post('/friendship/follow', friendship.follow);
router.post('/friendship/unfollow', friendship.unfollow);

// Highlights route endpoints.
const highlights = require('./highlights');
router.post('/highlights/highlights_tray', highlights.highlights_tray);

// Media route endpoints.
const media = require('./media');
router.post('/media/comment', media.comment);
router.post('/media/comment_delete', media.comment_delete);
router.post('/media/comment_like', media.comment_like);
router.post('/media/comment_unlike', media.comment_unlike);
router.post('/media/encode', media.encode);
router.post('/media/like', media.like);
router.post('/media/save', media.save);
router.post('/media/seen', media.seen);
router.post('/media/unlike', media.unlike);
router.post('/media/unsave', media.unsave);
router.post('/media/video', media.video);

// Search route endpoints.
const search = require('./search');
router.post('/search/recent', search.recent);
router.post('/search/recent_clear', search.recent_clear);
router.post('/search/recent_hide', search.recent_hide);
router.post('/search/recent_register', search.recent_register);
router.post('/search/users', search.users);

// User route endpoints.
const user = require('./user');
router.post('/user/profile', user.profile);

module.exports = router;