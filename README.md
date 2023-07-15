# Social Media Backend

This is the backend component of a social media application. It provides the necessary APIs and functionality to handle user authentication, post creation, and interaction between users.

## Features

- User authentication: Sign up, log in, and manage user sessions.
- Post management: Create, read, update, get timeline posts, and delete posts.
- User interaction: Like, dislike, comment, and share posts.
- Follow system: Allow users to follow other users and see their posts.
<!-- - Notifications: Send real-time notifications for relevant activities. -->

## Technologies Used

- Node.js: JavaScript runtime environment.
- Express.js: Web application framework for Node.js.
- MongoDB: Document database for data storage.
- Mongoose: MongoDB object modeling for Node.js.
- JSON Web Tokens (JWT): Token-based authentication mechanism.
<!-- - Socket.IO: Real-time communication library for notifications. -->

## Getting Started

To get started with the social media backend, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install the dependencies: `npm install`
3. Set up the environment variables. Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=3000
MONGODB_URI=mongodb://localhost/social-media-db
JWT_SECRET=your-secret-key
```

4. Start the server: `npm start`

## API Endpoints

The following API endpoints are available:

- `POST /api/v1/auth/signUp`: Create a new user account.
- `POST /api/v1/auth/logIn`: Log in with an existing user account.
- `POST /api/v1/auth/logout`: Log out the current user.
- `GET /api/v1/posts`: Get a list of all posts from current user and following users.
- `POST /api/v1/posts`: Create a new post.
- `GET /api/v1/posts/:postId`: Get details of a specific post.
- `GET /api/v1/user/all`: Get all registered user.
- `GET /api/v1/user/all/counts`: Get all registered user counts.
- `GET /api/v1/user/:id`: Get a specific user.
- `GET /api/v1/user/all/admins`: Get all admins and counts.
- `GET /api/v1/user/all/superAdmins`: Get all super admins and
- `PUT /api/v1/posts/:postId`: Update a specific post.
- `DELETE /api/v1/posts/:postId`: Delete a specific post.
- `POST /api/v1/posts/:postId/like`: Like a specific post.
- `POST /api/v1/posts/:postId/comment`: Add a comment to a specific post.
<!-- - `POST /api/v1/posts/:postId/share`: Share a specific post. -->
- `PUT /api/v1/users/:Id/follow`: Follow a specific user.
- `PUT /api/v1/users/:Id/follow`: Follow a specific user.
- `POST /api/v1/users/forgotten/password`: Forgotten password.
- `PUT /api/v1/users/change/password`: Change a user password in a standard and modernize way.
- `PUT /api/v1/users/resetPassword/:id`: Reset Password with a token received from ur mail.
- `PUT /api/v1/users/update/:id`: Update a specific user.
<!-- - `POST /api/v1/notifications/subscribe`: Subscribe to real-time notifications.
- `POST /api/v1/notifications/unsubscribe`: Unsubscribe from real-time notifications. -->

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or suggestions, feel free to contact me at [davidchibueze47@gmail.com](OtiDavidChibueze:davidchibueze47@gmail.com).
