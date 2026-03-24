# Increment 4: Subject Management

Extends Increment 3 with:
- Subject creation and listing
- Subject mapping to courses and semesters
- Subject descriptions

## New Models
- **Subject**: Stores subject_name, subject_code, course_id, semester, description

## New API Endpoints
- `GET /api/subjects`: Get all subjects with course data
- `POST /api/subjects`: Create new subject
