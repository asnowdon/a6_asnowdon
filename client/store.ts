import Vue, { del } from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various component.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    followers: [], //All followers of username
    visitingUsername: null,
    likes: [],
    likesCount: null,
    bestFreets:[]
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateBestFreets(state, bestFreets) {
      /**
       * Update the stored bestFreets to the provided bestFreets.
       * @param bestFreets - bestFreets to store
       */
      state.bestFreets = bestFreets;
    },
    
    updateFollowers(state, followers) {
      /**
       * Update the stored followers to the provided followers.
       * @param followers - followers to store
       */
      // console.log(followers);
      state.followers = followers;
    },
    addFollower(state, follower) {
      /**
       * Update the stored followers with follower.
       * @param follower - follower to store
       */
      // console.log(followers);
      state.followers.push(follower);
    },
    updateVisitingUsername(state, visitingUsername) {
      /**
       * Update the stored visiting acct username to the provided following.
       * @param visiting - visiting account username to store
       */
      state.visitingUsername = visitingUsername;
    },
    updateLikesCount(state, likesCount) {
      /**
       * Update the stored likesCount to the provided likesCount.
       * @param likesCount - likesCount to store
       */
      // console.log(followers);
      state.likesCount = likesCount;
    },
    incrementLikesCount(state) {
      /**
       * Update the stored likesCount to the provided likesCount.
       * @param likesCount - likesCount to store
       */
      // console.log(followers);
      state.likesCount += 1;
    },
    setLikes(state, likes) {
      /**
       * Update the stored likes array to the specified ones.
       * @param likes - new likes array to set
       */
      // var likesSet = new Set(likes);

      state.likes = likes;
    },
    addLike(state,like) {
      /**
       * Update the stored likes to include the provided like.
       * @param like - like to store
       */
      state.likes.push(like);
    },
    delLike(state,freetId) {
      /**
       * Update the stored likes to include the provided like.
       * @param like - like to store
       */
      //  state.likes.forEach(like => {
      //     if(like.freetId ==== freetId){
            
      //     }
      // });
      for(let i = 0; i < state.likes.length; i++){
        let like = state.likes[i];
        if(like.freetId===freetId){
          delete state.likes[i];
        }
      }
    },
    async refreshLikes(state) {
      /**
       * Request the server for the currently available freets.
       */
      // const url = `/api/likes?username=${state.username}`;
      // const res = await fetch(url).then(async r => r.json());
      // state.likes = res; 
      fetch(`/api/likes?username=${state.username}`).then(res2 => res2.json()).then(res2 => {
        // this.$store.commit('setLikes',res2);
        state.likes = res2;
      });               
    },
    async refreshFollowers(state) {
      /**
       * Request the server for the currently available freets.
       */
      // const url = `/api/likes?username=${state.username}`;
      // const res = await fetch(url).then(async r => r.json());
      // state.likes = res; 
      fetch(`/api/followers?username=${state.visitingUsername}`).then(res => res.json()).then(res => {
        // this.$store.commit('setLikes',res2);
        state.followers = res;
      });               
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
