<template>
  <LoginButton/>
  <p>This is the home page</p>
</template>

<script lang="ts">
import LoginButton from '@/components/LoginButton.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    LoginButton,
},
  
});
</script>