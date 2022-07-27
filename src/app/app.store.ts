import { createStore } from "@stencil/store";

const { state } = createStore({
  languageSelected: localStorage.getItem('language') || 'en',
  languageUpdated: true,
  recentLoaded: false,
  recentSearches: [],
  savedPosts: [],
  userName: localStorage.getItem('username'),
  userPk: localStorage.getItem('userpk'),
  userPage: null,
});

export default state;