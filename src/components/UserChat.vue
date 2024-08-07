<template>
  <v-card class="chat-container d-flex flex-column fill-height">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="title-container">
        <v-btn icon class="ma-3" @click="startVideoCall">
          <v-icon>mdi-video</v-icon>
        </v-btn>
        <span>{{ title }}</span>
      </div>
      <div class="video-container">
        <video ref="remoteVideo" autoplay playsinline class="remote-video"></video>
        <video ref="localVideo" autoplay playsinline class="local-video"></video>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-list ref="messagesContainer" class="messages-container">
      <v-list-item v-for="(message) in messages" :key="message.id">
        <v-list-item-content
            v-if="message && message.content"
            :class="message.sender_id === userKey ? 'sent' : 'received'"
        >
          <v-card
              :class="message.sender_id === userKey ? 'bg-royal-blue sent-card' : 'bg-grey-lighten-3 received-card'"
              class="pa-2"
              :style="{ maxWidth: '75%', borderRadius: '12px', marginBottom: '10px' }"
          >
            <template v-if="editingMessage === message.id">
              <v-text-field
                  v-model="editText"
                  dense
                  hide-details
                  class="edit-text-field"
                  @keyup.enter="() => saveEdit(message)"
              ></v-text-field>
              <v-icon small @click="() => saveEdit(message)" class="action-icon">mdi-check</v-icon>
            </template>
            <template v-else>
              <v-list-item-title>{{ message.content }}</v-list-item-title>
              <div v-if="message.sender_id === userKey" class="message-actions">
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
          <v-btn color="red darken-1" text @click="deleteMessage" class="action-icon">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="incomingCall" max-width="290">
      <v-card>
        <v-card-title class="headline">Incoming Call</v-card-title>
        <v-card-text>{{ caller }} is calling. Do you want to accept the call?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="acceptCall">Accept</v-btn>
          <v-btn color="red darken-1" text @click="rejectCall">Reject</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import { handleSendMessage, handleSaveEdit, handleConfirmDelete } from '../utils/chatUtils'
import { config } from '../config/config'
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
    updateMessage: {
      type: Function,
      required: true,
    },
    deleteMessage: {
      type: Function,
      required: true,
    },
    loadMessages: {
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
    const ws = ref(null)

    const localVideo = ref(null)
    const remoteVideo = ref(null)
    const localStream = ref(null)
    const peerConnection = ref(null)
    const incomingCall = ref(false)
    const caller = ref('')

    const connectWebSocket = () => {
      return new Promise((resolve, reject) => {
        ws.value = new WebSocket(config.wsUrl)

        ws.value.onopen = () => {
          console.log('WebSocket connected')
          ws.value.send(JSON.stringify({type: 'register', userKey: props.userKey}))
          resolve()
        }

        ws.value.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        ws.value.onclose = () => {
          console.log('WebSocket connection closed')
        }
      })
    }

    onMounted(async () => {
      console.log(`Initial messages for ${props.userKey}:`, props.messages)

      try {
        await connectWebSocket()

        localStream.value = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
        localVideo.value.srcObject = localStream.value
        setupPeerConnection()
      } catch (error) {
        console.error('Error initializing application:', error)
      }

      ws.value.onmessage = async (event) => {
        const message = JSON.parse(event.data)

        if (message.type === 'offer') {
          incomingCall.value = true
          caller.value = config.userNames[message.userKey]

          await peerConnection.value.setRemoteDescription(new RTCSessionDescription(message.data))
        }

        if (message.type === 'answer' && peerConnection.value) {
          await peerConnection.value.setRemoteDescription(new RTCSessionDescription(message.data))
        }

        if (message.type === 'candidate' && peerConnection.value) {
          await peerConnection.value.addIceCandidate(new RTCIceCandidate(message.data))
        }
      }
    })

    const setupPeerConnection = () => {
      peerConnection.value = new RTCPeerConnection({
        iceServers: config.stunServers // Use servers from config file
      })

      localStream.value.getTracks().forEach(track => peerConnection.value.addTrack(track, localStream.value))

      peerConnection.value.ontrack = (event) => {
        if (remoteVideo.value) {
          remoteVideo.value.srcObject = event.streams[0]
        }
      }

      peerConnection.value.onicecandidate = (event) => {
        if (event.candidate) {
          ws.value.send(JSON.stringify({
            type: 'candidate',
            data: event.candidate,
            target: props.userKey === 'user_one' ? 'user_two' : 'user_one',
            userKey: props.userKey
          }))
        }
      }
    }

    const startVideoCall = async () => {
      try {
        const offer = await peerConnection.value.createOffer()
        await peerConnection.value.setLocalDescription(offer)
        ws.value.send(JSON.stringify({
          type: 'offer',
          data: offer,
          target: props.userKey === 'user_one' ? 'user_two' : 'user_one',
          userKey: props.userKey
        }))
      } catch (error) {
        console.error('Error starting video call:', error)
      }
    }
    const acceptCall = async () => {
      incomingCall.value = false
      if (peerConnection.value.remoteDescription) {
        const answer = await peerConnection.value.createAnswer()
        await peerConnection.value.setLocalDescription(answer)

        ws.value.send(JSON.stringify({
          type: 'answer',
          data: answer,
          target: props.userKey === 'user_one' ? 'user_two' : 'user_one',
          userKey: props.userKey
        }))
      }
    }

    const rejectCall = () => {
      incomingCall.value = false
      if (peerConnection.value) {
        peerConnection.value.close()
        peerConnection.value = null
      }
    }

    const sendMessage = () => {
      handleSendMessage(props.userKey, newMessage.value, props.addMessage, ws.value)
      newMessage.value = ''
    }

    const startEditing = (message) => {
      editingMessage.value = message.id
      editText.value = message.content
    }

    const saveEdit = (message) => {
      handleSaveEdit(editText.value, message, props.updateMessage, ws.value)
      editingMessage.value = null
      editText.value = ''
    }

    const confirmDelete = (message) => {
      dialog.value = true
      messageToDelete.value = message
    }

    const deleteMessage = () => {
      handleConfirmDelete(messageToDelete.value, props.deleteMessage, ws.value)
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
      // eslint-disable-next-line vue/no-dupe-keys
      deleteMessage,
      startVideoCall,
      localVideo,
      remoteVideo,
      acceptCall,
      rejectCall,
      incomingCall,
      caller
    }
  }
}
</script>