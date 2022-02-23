&nbsp;

![](/src/assets/images/logo-full.svg#gh-light-mode-only)
![](/src/assets/images/logo-full-lite.svg#gh-dark-mode-only)

# Instagular

**Instagular** is a custom web client for Instagram, aiming for a better desktop experience, unlike the mobile-on-web design that the official site has, while adding extra features not found on regular Instagram.

&nbsp;

![](/src/assets/screens/0.png)

&nbsp;

This project implements its own backend API server using [instagram-private-api](https://github.com/dilame/instagram-private-api) to connect/interface to Instagram, acting as a middleware between the Instagular client and the Instagram server.

The app is fully compatible with Instagram routing structure, so it's possible to replace the domain with Instagular's and continue navigating right away.

While the app should be safe to use normally, there's the possibility for the user account to get blocked if too many request are made in a short period of time, so keep this in mind when using the app.

## Implemented features

- Login/logout with persistent session on local storage.
- Feeds with auto pagination management.
- Fullscreen media viewer, with high quality photos and videos play.
- Profile user pages.
- Like/unlike posts, follow/unfollow users.
- High/original quality media download.
- Users search bar.

Planned features:

- Stories full support (view and interaction).
- View/post comments.
- Direct messaging.
- Activity/notifications.
- Quality of life options (dark mode, accesibility, etc.)

## Getting started

For now, Instagular is only runnable locally, but eventually (when it reaches a fully-featured state, and I get a domain name) it'll be available online, as well as a dedicated desktop app.

For your (and mine) convenience, after installing the dependencies (`npm install`), just run the API backend server with `runapi` and then the app client with `runapp`.