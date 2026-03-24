# Increment 2: Student Management

Extends Increment 1 with:
- Student profile view & list
- Profile editing
- Academic history tracking (SGPA/CGPA base)
- Student search & filter base

## New Models
- **AcademicHistory**: Tracks SGPA, CGPA, and status per semester

## New API Endpoints
- `GET /api/students`: Get all students
- `GET /api/students/:id`: Get specific student profile & history
- `PUT /api/students/:id`: Update student profile data
