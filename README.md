-->Vedaz Real-Time Chat Application

-->About the Project

This is a real-time chat application built as part of the Vedaz software developer assignment.

The application allows multiple users to join a common chat using a username and send messages to each other in real time. Socket.IO is used for real-time communication, while MongoDB is used to store messages so that previous messages can be viewed after refreshing the application.

-->Technologies Used

Frontend:

.React
. JavaScript
. Socket.IO Client
. CSS

Backend:

. Node.js
. Express.js
. Socket.IO
. MongoDB
. Mongoose
. CORS
. dotenv

-->Main Features

. Users can join the chat using a username.
. Users can send messages in real time.
. New messages appear without refreshing the page.
. Previous messages are loaded when the application is opened or refreshed.
. Messages show the username and time.
. Online user count is displayed.
. Users can see when another user is typing.
. Online user count is displayed and updated when users join or leave.
. Messages are stored in MongoDB.
. Socket connection errors are handled on the frontend.

-->Project Structure

```text
vedaz-chat
|
|-- backend
|   |-- config
|   |   |-- db.js
|   |
|   |-- controllers
|   |   |-- messageController.js
|   |
|   |-- models
|   |   |-- Message.js
|   |
|   |-- routes
|   |   |-- messageRoutes.js
|   |
|   |-- server.js
|   |-- package.json
|   |-- .env
|
|-- frontend
|   |-- src
|   |   |-- components
|   |       |-- Chat.jsx
|   |       |-- MessageInput.jsx
|   |       |-- MessageList.jsx
|   |
|   |-- package.json
|
|-- README.md
|-- .gitignore
```

-->REST APIs

The backend provides two REST APIs.

-->Get previous messages

```text
GET /api/messages
```

This API gets the messages stored in MongoDB. The frontend calls this API when the chat page loads so that previous messages are available after refreshing the page.

-->Send message

```text
POST /api/messages
```

This API is implemented in the backend to create and store a message in MongoDB.

For the real-time chat interface, messages are sent through Socket.IO so that connected users can receive them immediately.

-->Socket.IO

Socket.IO is used for the real-time part of the application.

When a user opens the chat, the frontend creates a Socket.IO connection with the backend.

When a user sends a message, the frontend emits the send-message event.

The backend receives the event, stores the message in MongoDB and then broadcasts the saved message using the receive-message event.

This allows all connected users to see the new message immediately without refreshing the page.

Some of the Socket.IO events used in the project are:

```text
join-chat
send-message
receive-message
typing
user-typing
stop-typing
user-stop-typing
online-users
user-joined
user-left
disconnect
```

-->MongoDB

MongoDB is used to store chat messages.

Each message contains:

. Username
. Message
. Created time

The created time is also used to display the timestamp in the chat.

-->How to Run the Backend

Open the terminal and go to the backend folder.

```bash
cd backend
```

Install the required packages.

```bash
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend.

```bash
npm start
```

If nodemon is configured in the project, you can also use:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

-->How to Run the Frontend

Open another terminal and go to the frontend folder.

```bash
cd frontend
```

Install the packages.

```bash
npm install
```

Start the React application.

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

Open the frontend URL in your browser.

-->How to Test the Chat

Open the application in two browser tabs.

Enter different usernames in each tab.

For example:

```text
Tab 1: Manish
Tab 2: Rahul
```

Send a message from one tab. The message should appear in the other tab immediately.

You can also test the typing indicator and online user count.

After refreshing the page, previously stored messages should still be visible because they are loaded from MongoDB using the REST API.

-->Design Decisions

I used React for the frontend because it makes it easier to divide the application into components.

The chat page is separated into different components such as Chat, MessageInput and MessageList.

I used REST APIs for normal HTTP operations, especially for fetching the existing chat history.

I used Socket.IO for real-time communication because the application needs to deliver new messages immediately to connected users.

MongoDB is used to store messages so that chat history is not lost when the page is refreshed.

-->Assumptions

This project uses a simple username-based login. There is no password or full user authentication because authentication was not required for this assignment.

The application currently uses a common chat room where all connected users can see the messages.

The application is configured for local development using localhost.

-->Error Handling

The backend checks that usernames and messages are not empty before saving them.

The application also handles errors while fetching messages from the REST API.

Socket connection errors are handled on the frontend and a connection error message is shown when the client cannot connect to the server.

-->Author

Manish Kumar

B.Tech Information Technology
