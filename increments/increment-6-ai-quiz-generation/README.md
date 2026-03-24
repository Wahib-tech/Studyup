# Increment 6: AI Quiz Generation

Extends Increment 5 with:
- Google Gemini AI integration for quiz generation
- File and text processing for automated question creation
- Quiz storage and management
- Basic quiz attempt and result tracking (Performance)

## New Models
- **Quiz**: Stores generated questions, options, answers, and metadata
- **Performance**: Track quiz scores and completion dates

## API Endpoints
- `POST /api/ai/generate`: Send text to Gemini and receive structured quiz
- `GET /api/quizzes`: List available quizzes
- `POST /api/quizzes/submit`: Save user's quiz attempt results

## Setup
Ensure `GEMINI_API_KEY` is set in `.env` to use the generation features.
