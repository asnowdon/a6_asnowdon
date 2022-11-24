<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <FollowUserForm />
    <!-- <h3> {{$store.state.likes}} </h3> -->

    <!-- <h3> {{$store.state.followers.length}} followers </h3> -->
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import FollowUserForm from '@/components/Account/FollowUserForm.vue';
import GetFollowersForm from '@/components/Account/GetFollowersForm.vue';
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';

export default {
  name: 'AccountPage',
  components: {
    FollowUserForm,
    GetFollowersForm,
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm
  },
    beforeCreate() {
    // Sync stored username to current session
    fetch(`/api/followers?username=${this.$store.state.username}`).then(res => res.json()).then(res => {
      this.$store.commit('updateFollowers', res);
    });
    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }

};
</script>
