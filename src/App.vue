<template>
  <v-app>
    <v-main class="fill-height">
      <ChatDashboard />
    </v-main>
  </v-app>
</template>

<script>
import ChatDashboard from './components/ChatDashboard.vue'

export default {
  name: 'App',

  components: {
    ChatDashboard,
  },

  data: () => ({
    //
  }),
}
</script>
