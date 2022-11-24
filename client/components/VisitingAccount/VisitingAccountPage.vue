<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <h2>@{{ $store.state.visitingUsername }}</h2>
    <!-- //discription  -->
    <h4>Account description: {{this.description}}</h4>
    <h3> {{$store.state.followers.length}} followers </h3>
    <FollowUserForm />

      <div
        class="actions"
      >

      </div>

    <section
      v-if="$store.state.freets.length"
    >
      <FreetComponent
        v-for="freet in $store.state.freets"
        :key="freet.id"
        :freet="freet"
      />
    </section>
    <article
      v-else
    >
      <h3>No freets found.</h3>
    </article>


  </main>
</template>

<script>
import FollowUserForm from '@/components/VisitingAccount/FollowUserForm.vue';
import GetFollowersForm from '@/components/Account/GetFollowersForm.vue';
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'AccountPage',
  data(){
    return {
      description:''
    }
  },
  components: {
    FollowUserForm,
    GetFollowersForm,
    FreetComponent
  },
    beforeCreate() {
    // Sync stored username to current session
    fetch(`/api/followers?username=${this.$route.params.username}`).then(res => res.json()).then(res => {
      this.$store.commit('updateFollowers', res);
    });

    fetch(`/api/descriptions?username=${this.$route.params.username}`).then(res => res.json()).then(res => {
      this.description = res.description.content;

    });

    fetch(`/api/freets?author=${this.$route.params.username}`).then(res => res.json()).then(res => {
      this.$store.commit('updateFreets', res);
    });
          
    // Clear alerts on page refresh
    this.$store.state.alerts = {};
    this.$store.commit('updateVisitingUsername', this.$route.params.username);

  },
  methods:{
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

  }
  
};
</script>
