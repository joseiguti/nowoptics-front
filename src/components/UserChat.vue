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
      <v-list-item v-for="(message) in messages" :key="message.id">
        <v-list-item-content :class="message.user === userKey ? 'sent' : 'received'">
          <v-card
              :class="message.user === userKey ? 'bg-royal-blue sent-card' : 'bg-grey-lighten-3 received-card'"
              class="pa-2"
              :style="{ maxWidth: '75%', borderRadius: '12px', marginBottom: '10px' }"
          >
            <template v-if="editingMessage === message.id">
              <v-text-field
                  v-model="editText"
                  dense
                  hide-details
                  class="edit-text-field"
                  @keyup.enter="saveEdit(message)"
              ></v-text-field>
              <v-icon small @click="saveEdit(message)" class="action-icon">mdi-check</v-icon>
            </template>
            <template v-else>
              <v-list-item-title>{{ message.text }}</v-list-item-title>
              <div v-if="message.user === userKey" class="message-actions">
                <v-icon small @click="startEditing(message)" class="action-icon">mdi-pencil</v-icon>
                <v-icon small @click="confirmDelete(message)" class="action-icon">mdi-delete</v-icon>
              </div>
            </template>
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
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this message?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="deleteMessage">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    const editingMessage = ref(null)
    const editText = ref('')
    const dialog = ref(false)
    const messageToDelete = ref(null)

    const sendMessage = () => {
      if (newMessage.value.trim() !== '') {
        props.addMessage(props.userKey, newMessage.value)
        newMessage.value = ''
      }
    }

    const startEditing = (message) => {
      editingMessage.value = message.id
      editText.value = message.text
    }

    const saveEdit = (message) => {
      const index = props.messages.findIndex(m => m.id === message.id)
      if (index !== -1) {
        // eslint-disable-next-line vue/no-mutating-props
        props.messages[index].text = editText.value
      }
      editingMessage.value = null
      editText.value = ''
    }

    const confirmDelete = (message) => {
      dialog.value = true
      messageToDelete.value = message
    }

    const deleteMessage = () => {
      const index = props.messages.findIndex(m => m.id === messageToDelete.value.id)
      if (index !== -1) {
        // eslint-disable-next-line vue/no-mutating-props
        props.messages.splice(index, 1)
      }
      dialog.value = false
      messageToDelete.value = null
    }

    return {
      newMessage,
      sendMessage,
      editingMessage,
      editText,
      startEditing,
      saveEdit,
      dialog,
      confirmDelete,
      deleteMessage,
    }
  },
}
</script>