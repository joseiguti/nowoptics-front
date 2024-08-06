import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000';

export async function loadMessages() {
    try {
        const response = await axios.get(`${API_BASE_URL}/messages`)
        return response.data
    } catch (error) {
        console.error('Error loading messages:', error)
        return []
    }
}

export async function addMessage(user, text) {
    try {
        const response = await axios.post(`${API_BASE_URL}/messages`, {
            sender_id: user,
            receiver_id: user === 'user_one' ? 'user_two' : 'user_one',
            content: text,
        })
        return response.data.data
    } catch (error) {
        console.error('Error adding message:', error)
        return null
    }
}

export async function updateMessage(id, text) {
    try {
        await axios.put(`${API_BASE_URL}/messages/${id}`, {
            content: text,
        })
        return true
    } catch (error) {
        console.error('Error updating message:', error)
        return false
    }
}

export async function deleteMessage(id) {
    try {
        await axios.delete(`${API_BASE_URL}/messages/${id}`)
        return true
    } catch (error) {
        console.error('Error deleting message:', error)
        return false
    }
}

export function handleSendMessage(userKey, newMessage, addMessage, ws) {
    if (newMessage.trim() !== '') {
        addMessage(userKey, newMessage)
        ws.send(JSON.stringify({ type: 'new_message' }))
    }
}

export function handleSaveEdit(editText, message, updateMessage, ws) {
    if (editText.trim() !== '') {
        updateMessage(message.id, editText)
        ws.send(JSON.stringify({ type: 'update_message' }))
    }
}

export function handleConfirmDelete(message, deleteMessage, ws) {
    deleteMessage(message.id)
    ws.send(JSON.stringify({ type: 'delete_message' }))
}