<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="bestFreet"
  >
    <header>
      <h3 class="creator">
        <router-link :to="{ name: 'profile'}">
          @{{ $store.state.username }}
        </router-link>
      </h3>
      <FreetComponent
        :key="bestFreet.freet._id"
        :freet="bestFreet.freet"
      />
    </header>
    <section>
      created {{bestFreet.dateUsed}}
    </section>


  </article>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';

export default {
  name: 'BestFreetComponent',
  components: {FreetComponent},
  props: {
    // Data from the stored freet
    bestFreet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      likesCount: null,
      bestFreetCount: null,
      alreadyLiked: false
    };
  },

  methods: {
  }
};
</script>

<style scoped>
.bestFreet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
    background-color: darkgrey;
}
</style>
