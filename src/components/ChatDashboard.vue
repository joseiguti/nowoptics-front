<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">

      <v-col cols="12" md="6" class="d-flex fill-height">
        <UserChat
            title="User One"
            :messages="messages"
            userKey="user_one"
            :addMessage="addMessage"
        />
      </v-col>


      <v-col cols="12" md="6" class="d-flex fill-height">
        <UserChat
            title="User Two"
            :messages="messages"
            userKey="user_two"
            :addMessage="addMessage"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import UserChat from './UserChat.vue'
import '../styles/ChatDashboardStyles.css'

export default {
  components: {
    UserChat,
  },
  setup() {
    const messages = ref([
      { id: 1, user: 'user_one', text: 'How are you doing?' },
      { id: 2, user: 'user_two', text: 'Doing well thank you!' },
    ])

    const addMessage = (user, text) => {
      messages.value.push({
        id: messages.value.length + 1,
        user: user,
        text: text,
      })
    }

    return {
      messages,
      addMessage,
    }
  },
}
</script>
