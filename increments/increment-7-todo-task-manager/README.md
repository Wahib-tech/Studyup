# Increment 7: Todo & Task Manager

Extends Increment 6 with:
- Task list and status tracking
- Completion system
- Optional linkage to subjects
- Due date management

## New Models
- **TodoTask**: Stores task title, description, status, and due date

## New API Endpoints
- `GET /api/tasks`: Get all tasks for logged-in student
- `POST /api/tasks`: Create new task
- `PUT /api/tasks/:id`: Update task status or details
