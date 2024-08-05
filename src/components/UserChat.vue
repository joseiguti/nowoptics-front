<template>
  <v-card class="chat-container d-flex flex-column fill-height">
    <v-card-title class="d-flex align-center">
      <v-btn icon class="ma-3">
        <v-icon>mdi-video</v-icon>
      </v-btn>
      {{ title }}
    </v-card-title>
    <v-divider></v-divider>
    <v-list class="messages-container">
      <v-list-item v-for="message in messages" :key="message.id">
        <v-list-item-content
            :class="message.user === userKey ? 'sent' : 'received'"
        >
          <v-card
              :class="message.user === userKey ? 'bg-royal-blue sent-card' : 'bg-grey-lighten-3 received-card'"
              class="pa-2"
              :style="{ maxWidth: '75%', borderRadius: '12px', marginBottom: '10px' }"
          >
            <v-list-item-title>{{ message.text }}</v-list-item-title>
          </v-card>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-row align="center" class="message-input">
      <v-col class="d-flex align-center">
        <v-text-field
            v-model="newMessage"
            label="Type a message"
            outlined
            dense
            hide-details
            class="flex-grow-1"
            @keyup.enter="sendMessage"
        ></v-text-field>
        <v-btn color="primary" @click="sendMessage" icon>
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { ref } from 'vue'
import '../styles/UserChatStyles.css'

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    messages: {
      type: Array,
      required: true,
    },
    userKey: {
      type: String,
      required: true,
    },
    addMessage: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const newMessage = ref('')

    const sendMessage = () => {
      if (newMessage.value.trim() !== '') {
        props.addMessage(props.userKey, newMessage.value)
        newMessage.value = ''
      }
    }

    return {
      newMessage,
      sendMessage,
    }
  },
}
</script>