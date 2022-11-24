<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        <router-link :to="{ name: 'visitingAccount', params: { username: freet.author } }">
          @{{ freet.author }}
        </router-link>
        {{$store.state.likes}}

      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
     
      </div>


    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>

      <div
        class="actions"
      >
        {{freet.likes}}
        <button @click="likeFreet" 
                v-if="!alreadyLiked">
            <3
        </button>   

        <button @click="unlikeFreet" 
                v-if="alreadyLiked">
            <3 'ed
        </button>   
        
        {{freet.bestFreets}}
        <button @click="bestFreetFreet">
            <<33
        </button>   
      </div>

      <!-- {{$store.state.likes}} -->

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  data() {
    alreadyLiked:false
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      likesCount: null,
      bestFreetCount: null,
      // alreadyLiked: []
    };
  },
  created() {
    //this.$store.commit('refreshLikes');
    this.$store.state.likes.forEach(like => {
      if(like.freetId  === this.freet._id){
        this.alreadyLiked = true;
      }
    });
    this.bestFreetCount = this.$store.state.likes;
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async reactFreet(params) {
      /**
       * react this freet.
       */     
      const options = {
        method: params.method, 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({freetId: this.freet._id})
      };
      try {
        var r;
        var reqUrl;
        if(params.url){
          reqUrl = params.url;
        }
        else if(params.reaction == "like"){
          reqUrl = "/api/likes";
        }else if (params.reaction == "bestFreet"){
          reqUrl = "/api/bestFreets";
        }

        r = await fetch(reqUrl, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();


        //this.$store.commit('refreshFreets');
        //this.$store.commit('incrementLikesCount');
        params.callback(res);

        
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async likeFreet() {
      /**
       * likes this freet.
       */
      //if the $store.state.likes contains this like,
      //      we dislike it (delete like)
      const params = {
        method: 'POST',
        message: 'Successfully liked freet!',
        reaction: "like",
        callback: (like) => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          //this.$store.commit('addLike',res.like);
          this.$store.commit('refreshFreets');
          this.$store.commit('refreshLikes');

          this.$store.commit('addLike',like.like)
          this.alreadyLiked = true
          // this.likesCount += 1;

        }
      };
      this.reactFreet(params);
    },
    async unlikeFreet() {
      /**
       * unlikes this freet.
       */
      const params = {
        method: 'DELETE',
        message: 'Successfully un-liked freet!',
        url: `/api/likes/${this.freet._id}`,
        callback: (res) => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          this.$store.commit('refreshFreets');
          this.$store.commit('refreshLikes');
          this.$store.commit('delLike', this.freet._id);
          this.alreadyLiked = false;

        }
      };
      this.reactFreet(params);
    },

    async bestFreetFreet() {
      /**
       * bestFreets this freet.
       */
        const params = {
        method: 'POST',
        message: 'Successfully bestFreeted freet!',
        reaction: "bestFreet",
        callback: (res) => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          //this.$store.commit('addLike',res.like);
          this.$store.commit('refreshFreets');
          this.alreadybestFreeted = true;
        }
      };
      this.reactFreet(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    background-color:white;
}
</style>
