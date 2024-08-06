import axios from 'axios'

// Cargar mensajes desde el servidor
export async function loadMessages() {
    try {
        const response = await axios.get('http://localhost:3000/messages')
        return response.data
    } catch (error) {
        console.error('Error loading messages:', error)
        return []
    }
}

// Agregar un nuevo mensaje
export async function addMessage(user, text) {
    try {
        const response = await axios.post('http://localhost:3000/messages', {
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

// Actualizar un mensaje existente
export async function updateMessage(id, text) {
    try {
        await axios.put(`http://localhost:3000/messages/${id}`, {
            content: text,
        })
        return true
    } catch (error) {
        console.error('Error updating message:', error)
        return false
    }
}

// Eliminar un mensaje
export async function deleteMessage(id) {
    try {
        await axios.delete(`http://localhost:3000/messages/${id}`)
        return true
    } catch (error) {
        console.error('Error deleting message:', error)
        return false
    }
}

// Función para manejar el envío de mensajes
export function handleSendMessage(userKey, newMessage, addMessage, ws) {
    if (newMessage.trim() !== '') {
        addMessage(userKey, newMessage)
        ws.send(JSON.stringify({ type: 'new_message' }))
    }
}

// Función para manejar la edición de mensajes
export function handleSaveEdit(editText, message, updateMessage, ws) {
    if (editText.trim() !== '') {
        updateMessage(message.id, editText)
        ws.send(JSON.stringify({ type: 'update_message' }))
    }
}

// Función para manejar la confirmación de eliminación
export function handleConfirmDelete(message, deleteMessage, ws) {
    deleteMessage(message.id)
    ws.send(JSON.stringify({ type: 'delete_message' }))
}