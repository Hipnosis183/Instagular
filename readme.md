&nbsp;

![](/src/assets/images/logo-full.svg#gh-light-mode-only)
![](/src/assets/images/logo-full-lite.svg#gh-dark-mode-only)

&nbsp;

**Instagular** is a custom web client for Instagram, aiming for a better desktop experience, unlike the mobile-on-web design that the official site has, while adding extra features not found on regular Instagram.

![](/src/assets/screens/0.png)

This project implements its own backend API server using a custom updated fork of [instagram-private-api](https://github.com/Hipnosis183/instagram-private-api) to connect/interface to Instagram, acting as a middleware between the Instagular client and the Instagram server.

The app is fully compatible with Instagram routing structure, so it's possible to replace the domain with Instagular's and continue navigating right away.

While the app should be safe to use in general, there's still the possibility for the user account to get blocked if too many request are made in a short period of time, so keep this in mind when using the app.

## Implemented features

- Login/logout with persistent session on local storage.
- Feeds with auto pagination management.
- Fullscreen media viewer, with high quality photos and videos play.
- Profile user pages (posts, reels, videos, tagged).
- Stories/highlights support.
- User interaction (like/unlike, follow/unfollow).
- High/original quality media download.
- Saved collections management.
- Users search bar.

Planned features:

- Stories interaction.
- View/post comments.
- Direct messaging.
- Activity/notifications.
- Quality of life options (dark mode, accesibility, etc.)

## Getting started

For now, Instagular is only runnable locally, but eventually, when it reaches a fully-featured state, it'll be available online, as well as a dedicated desktop app.

Install both server and client dependencies by running `npm install` in the root and `src/api` directories. Then, just run the API backend server with `runapi` and then the app client with `runapp` if you're on Linux, or run `npm run dev` under the server directory and `npm run start` on root for the client on Windows.

> :warning: Important Note: Since the app is fully dependant on the private api library, which is actively being developed in tandem, make sure to always keep it updated, otherwise unsupported features will break the client functionality.