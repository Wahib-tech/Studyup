# Increment 3: Course & Section Management

Extends Increment 2 with:
- Course creation and listing
- Section creation and listing (linked to course)
- View students by course/section base

## New Models
- **Course**: Stores course_name, course_code, duration, description
- **Section**: Stores section_name, course_id, semester, academic_year

## New API Endpoints
- `GET /api/courses/courses`: Get all courses
- `POST /api/courses/courses`: Create new course
- `GET /api/courses/sections`: Get all sections with course data
- `POST /api/courses/sections`: Create new section
