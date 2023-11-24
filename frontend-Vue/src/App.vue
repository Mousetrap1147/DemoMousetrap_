<template>
  <v-app>
    <v-main>
      <LoginDialog/>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import LoginDialog from './components/LoginDialog.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  // component definition here
});
</script>