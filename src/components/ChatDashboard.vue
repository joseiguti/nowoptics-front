<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" md="6" class="d-flex fill-height">
        <UserChat
            title="User One"
            :messages="messages"
            userKey="user_one"
            :addMessage="handleAddMessage"
            :updateMessage="handleUpdateMessage"
            :deleteMessage="handleDeleteMessage"
            :loadMessages="loadMessages"
        />
      </v-col>
      <v-col cols="12" md="6" class="d-flex fill-height">
        <UserChat
            title="User Two"
            :messages="messages"
            userKey="user_two"
            :addMessage="handleAddMessage"
            :updateMessage="handleUpdateMessage"
            :deleteMessage="handleDeleteMessage"
            :loadMessages="loadMessages"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { ref, onMounted } from 'vue'
import { loadMessages as fetchMessages, addMessage, updateMessage, deleteMessage } from '../utils/chatUtils'
import UserChat from './UserChat.vue'
import '../styles/ChatDashboardStyles.css'

export default {
  components: {
    UserChat,
  },
  setup() {
    const messages = ref([])
    const loadMessages = async () => {
      const loadedMessages = await fetchMessages()
      messages.value = loadedMessages
    }
    const handleAddMessage = async (user, text) => {
      const newMessage = await addMessage(user, text)
      if (newMessage) {
        messages.value.push(newMessage)
      }
    }
    const handleUpdateMessage = async (id, text) => {
      const success = await updateMessage(id, text)
      if (success) {
        const index = messages.value.findIndex(m => m.id === id)
        if (index !== -1) {
          messages.value[index].content = text
        }
      }
    }
    const handleDeleteMessage = async (id) => {
      const success = await deleteMessage(id)
      if (success) {
        const index = messages.value.findIndex(m => m.id === id)
        if (index !== -1) {
          messages.value.splice(index, 1)
        }
      }
    }
    onMounted(loadMessages)

    return {
      messages,
      loadMessages,
      handleAddMessage,
      handleUpdateMessage,
      handleDeleteMessage,
    }
  },
}
</script>