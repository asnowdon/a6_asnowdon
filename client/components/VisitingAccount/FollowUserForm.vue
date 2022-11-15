<!-- Form for changing username (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'ChangeUsernameForm',
  mixins: [BlockForm],
  data() {
    return {
      url: `/api/followers`,
      method: 'POST',
      hasAnalogBody: true,
      body: { "username": this.$store.state.visitingUsername},
      fields: [],
      title: 'Follow user',
      callback: () => {
        const message = 'Successfully followed user!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
