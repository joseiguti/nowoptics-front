<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" md="6" class="d-flex fill-height">
        <UserChat
            title="User One"
            :messages="messages"
            userKey="user_one"
            :addMessage="addMessage"
            :updateMessage="updateMessage"
            :deleteMessage="deleteMessage"
        />
      </v-col>

      <v-col cols="12" md="6" class="d-flex fill-height">
        <UserChat
            title="User Two"
            :messages="messages"
            userKey="user_two"
            :addMessage="addMessage"
            :updateMessage="updateMessage"
            :deleteMessage="deleteMessage"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {ref, onMounted} from 'vue'
import axios from 'axios'
import UserChat from './UserChat.vue'
import '../styles/ChatDashboardStyles.css'

export default {
  components: {
    UserChat,
  },
  setup() {
    const messages = ref([])

    const loadMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/messages')
        messages.value = response.data
      } catch (error) {
        console.error('Error loading messages:', error)
      }
    }

    const addMessage = async (user, text) => {
      try {
        const response = await axios.post('http://localhost:3000/messages', {
          sender_id: user,
          receiver_id: user === 'user_one' ? 'user_two' : 'user_one',
          content: text,
        })
        messages.value.push(response.data.data)
      } catch (error) {
        console.error('Error adding message:', error)
      }
    }

    const updateMessage = async (id, text) => {
      try {
        await axios.put(`http://localhost:3000/messages/${id}`, {
          content: text,
        })
        const index = messages.value.findIndex(m => m.id === id)
        if (index !== -1) {
          messages.value[index].text = text
        }
      } catch (error) {
        console.error('Error updating message:', error)
      }
    }

    const deleteMessage = async (id) => {
      try {
        await axios.delete(`http://localhost:3000/messages/${id}`)
        const index = messages.value.findIndex(m => m.id === id)
        if (index !== -1) {
          messages.value.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting message:', error)
      }
    }

    onMounted(loadMessages)

    return {
      messages,
      addMessage,
      updateMessage,
      deleteMessage,
    }
  },
}
</script>