<template>
    <v-btn @click="dialog = true">Login</v-btn>
    <v-dialog v-model="dialog">
        <p>This is the login dialog</p>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            dialog: false
        }
    }
});
</script>