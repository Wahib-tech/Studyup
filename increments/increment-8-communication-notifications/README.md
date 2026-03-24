# Increment 8: Communication & Notifications

Extends Increment 7 with:
- System and user notifications
- Read/Unread status tracking
- Notification categorization (Quiz, Grade, Task, System)
- Real-time communication foundation

## New Models
- **Notification**: Stores title, message, type, and read_status for users

## New API Endpoints
- `GET /api/notifications`: Get all notifications for the user
- `PUT /api/notifications/:id/read`: Mark an individual notification as read
