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
      hasBody: true,
      fields: [
        {id: 'username', label: 'Username', value: ''}
      ],
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
