const express = require('express');
const router = express.Router();

// Account route endpoints.
const account = require('./account');
router.post('/account/login', account.login);
router.post('/account/logout', account.logout);

// Feed route endpoints.
const feed = require('./feed');
router.post('/feed/followers', feed.followers);
router.post('/feed/following', feed.following);
router.post('/feed/reels', feed.reels);
router.post('/feed/reels_media', feed.reelsMedia);
router.post('/feed/reels_tray', feed.reelsTray);
router.post('/feed/timeline', feed.timeline);
router.post('/feed/user', feed.user);
router.post('/feed/video', feed.video);

// Friendship route endpoints.
const friendship = require('./friendship');
router.post('/friendship/follow', friendship.follow);
router.post('/friendship/unfollow', friendship.unfollow);

// Highlights route endpoints.
const highlights = require('./highlights');
router.post('/highlights/highlights_tray', highlights.highlightsTray);

// Media route endpoints.
const media = require('./media');
router.post('/media/encode', media.encode);
router.post('/media/like', media.like);
router.post('/media/seen', media.seen);
router.post('/media/unlike', media.unlike);
router.post('/media/video', media.video);

// Search route endpoints.
const search = require('./search');
router.post('/search/users', search.users);

// User route endpoints.
const user = require('./user');
router.post('/user/profile', user.profile);

module.exports = router;