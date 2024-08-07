
# NowOptics Frontend

This is the frontend application for NowOptics, providing a user interface for real-time messaging and video calling between users.

See the Demo in the video https://youtu.be/4n2fwlU0CXo

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: version 14.x or later
- **npm**: version 6.x or later
- **Vue CLI**: version 4.x or later
- **Git**: version control system

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/joseiguti/nowoptics-front.git
cd nowoptics-front
npm install
```

## Usage

To run the application locally, use:

```bash
npm run serve
```

This command starts a local development server and the application can be accessed at `http://localhost:8080`.

### Build for Production

To build the application for production, use:

```bash
npm run build
```

### Lint and Fix Files

To lint and fix files, use:

```bash
npm run lint
```

## Project Structure

```
src/
|-- components/    # Vue components
|-- views/         # Application views
|-- assets/        # Static assets
|-- utils/         # Utility functions
|-- config/        # Configuration files
|-- styles/        # Global styles
|-- main.js        # Application entry point
```

## API Endpoints

The frontend communicates with the backend via the following API endpoints:

- **GET /messages**: Retrieve all chat messages.

  **Example request:**

  ```javascript
  fetch('http://localhost:3000/messages')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error fetching messages:', error))
  ```

- **POST /messages**: Send a new chat message.

  **Example request:**

  ```javascript
  fetch('http://localhost:3000/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender_id: 'user_one',
      receiver_id: 'user_two',
      content: 'Hello!',
    }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error sending message:', error))
  ```

- **PUT /messages/:id**: Update a chat message.

  **Example request:**

  ```javascript
  fetch('http://localhost:3000/messages/1', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: 'Updated message content',
    }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error updating message:', error))
  ```

- **DELETE /messages/:id**: Delete a chat message.

  **Example request:**

  ```javascript
  fetch('http://localhost:3000/messages/1', {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error deleting message:', error))
  ```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
