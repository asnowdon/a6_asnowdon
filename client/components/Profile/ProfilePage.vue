<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <h2>@{{ $store.state.username }}</h2>
    <h3> {{$store.state.followers.length}} followers </h3>
    <h3 v-if="description!=''"> Description: {{description}}</h3>
    <div
    class="actions">
      <button
        v-if="editingDescription"
        @click="submitEdit"
      >
        ✅ Save changes
      </button>
      <button
        v-if="editingDescription"
        @click="stopEditing"
      >
        🚫 Discard changes
      </button>
      <button
        v-if="!editingDescription"
        @click="startEditing"
      >
        ✏️ Edit Description
      </button>
    </div>

    <textarea
      v-if="editingDescription"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />

    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>


    <section
      v-if="$store.state.bestFreets.length"
    >
        <h4>Best Freets:</h4>
        <!-- <FreetComponent
          :key="$store.state.bestFreets[0].freet.id"
          :freet="$store.state.bestFreets[0].freet"
        /> -->
        <BestFreetComponent
          v-for="bestFreet in $store.state.bestFreets"
          :key="bestFreet.id"
          :best-freet="bestFreet"
        />
    </section>
    <article
      v-else
    >
      <h3>No bestFreets found.
          
      </h3>
    </article>

    <section
    v-if="$store.state.freets.length"
    > 
      <h4>Freets:</h4>
      <FreetComponent
        v-for="freet in $store.state.freets"
        :key="freet._id"
        :freet="freet"
      />

  </section>


  </main>
</template>

<script>
import FollowUserForm from '@/components/VisitingAccount/FollowUserForm.vue';
import GetFollowersForm from '@/components/Account/GetFollowersForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import BestFreetComponent from '@/components/BestFreet/BestFreetComponent.vue';
export default {
  name: 'AccountPage',
  components: {
    FollowUserForm,
    GetFollowersForm,
    FreetComponent,
    BestFreetComponent
  },
  data(){
    return{
      description:'',
      draft: '',
      editingDescription: false,
      alerts:{}
    }
  },
    beforeCreate() {
    fetch(`/api/descriptions?username=${this.$store.state.username}`).then(res => res.json()).then(res => {
      this.description = res.description.content;
    });
    // Sync stored username to current session
    fetch(`/api/followers?username=${this.$store.state.username}`).then(res => res.json()).then(res => {
      this.$store.commit('updateFollowers', res);
    });

    fetch(`/api/freets?author=${this.$store.state.username}`).then(res => res.json()).then(res => {
      this.$store.commit('updateFreets', res);
    });

    fetch(`/api/bestFreets?username=${this.$store.state.username}`).then(res => res.json()).then(res => {
      this.$store.commit('updateBestFreets', res);
    });
    // Clear alerts on page refresh
    // this.$store.state.alerts = {};
    this.$store.commit('updateVisitingUsername', this.$route.params.username);

  },
  methods:{
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editingDescription = true; // Keeps track of if a freet is being edited
      this.draft = this.description; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editingDescription = false;
      this.draft = this.description;
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.description === this.draft) {
        // this.description = "error"
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      const params = {
        method: 'PUT',
        message: 'Successfully edited description!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          // this.editingDescription = false;
          // this.description = res;
        }
      };
      this.request(params);
    },
    async followUser() {
      /**
       * follows this user.
       */
             
      const options = {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: this.$store.state.visitingUsername})
      };
    
      try {
        const r = await fetch("/api/followers", options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        const res = await r;

        this.$store.commit('addFollower', res);

        this.$store.commit('alert', {
          message: 'Successfully followed user!', status: 'success'
        });
        
      } catch (e) {
          //ERROR DOESNT THROW FOR FOLLOW USER BUTTON
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
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
        const r = await fetch(`/api/descriptions`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }
        const res = await r.json();
        // this.editing = false;
        this.editingDescription = false;
        this.description = res.description.content;
        // this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }

  }
  
};
</script>
