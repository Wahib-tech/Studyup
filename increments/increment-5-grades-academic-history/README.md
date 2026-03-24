# Increment 5: Grades & Academic History

Extends Increment 4 with:
- Mark entry and grade calculation
- Academic history tracking
- GPA/CGPA management tools
- Semester-wise result viewing

## New Models
- **Grade**: Stores marks, percentage, and grade letter for subjects

## New API Endpoints
- `GET /api/grades`: Get grades for a student
- `POST /api/grades`: Add new grade record
