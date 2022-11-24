<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <img src="../../public/logo.svg">
      <h1 class="title">
        Fritter
      </h1>
    </div>
    <div class="right">
      <ul>  
        <li>
          <router-link to="/">
            Home
          </router-link>
        </li>
        <li>  
          <router-link
          v-if="$store.state.username"
          to="/account"
        >
          Account
        </router-link>

        </li>

        <router-link
          v-if="$store.state.username"
          to="/profile"
        >
          Profile
        </router-link>
        <router-link
          v-else
          to="/login"
        >
          Login
        </router-link>
      </ul>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
    /*padding: 1vw 2vw;*/
    background-color: #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    height: 100%; /* Full height */
  }

.title {
    font-size: 32px;
    margin: 0 5px;
    margin-bottom: 280px;
}

img {
    margin-left: 120px;
    height: 32px;
    margin-bottom: 280px;
}

ul {
  list-style-type: none;

}

li{
  text-align: left;
  margin-top: 40px;
  margin-bottom: 40px;


}
.left {
	display: flex;
	align-items: center;
}

.right  {
   /* align-items: center;*/
   /* float:left;*/
    margin-left: 100px;
    font-size: 20px;
    display: block;
    gap: 16px;
    /*grid-auto-flow: column;*/
    position: absolute;
    /*align-items: center;*/
}

.right a {
  margin: 0;
    /*margin-left: 5px;*/
}

.alerts {
    width: 25%;
}
</style>
