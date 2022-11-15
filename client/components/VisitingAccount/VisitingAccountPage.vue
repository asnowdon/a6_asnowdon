<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <h2>@{{ $store.state.visitingUsername }}</h2>
    <h3> {{$store.state.followers.length}} followers </h3>
    <FollowUserForm />

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
import FreetComponent from '@/components/VisitingAccount/FreetComponent.vue';

export default {
  name: 'AccountPage',
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

    fetch(`/api/freets?author=${this.$route.params.username}`).then(res => res.json()).then(res => {
      this.$store.commit('updateFreets', res);
    });
          
    // Clear alerts on page refresh
    this.$store.state.alerts = {};
    this.$store.commit('updateVisitingUsername', this.$route.params.username);

  }
  
};
</script>
