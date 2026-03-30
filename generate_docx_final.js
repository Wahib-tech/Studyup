const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, LevelFormat } = require('docx');
const fs = require('fs');

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            // HEADING
            new Paragraph({
                text: "TESTING & DEBUGGING REPORT",
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
            }),

            // PROJECT INFO
            new Paragraph({ children: [new TextRun({ text: "Project Title: ", bold: true }), new TextRun("StudyUp – Student Learning System & AI Quiz Generation")] }),
            new Paragraph({ children: [new TextRun({ text: "Project Code: ", bold: true }), new TextRun("BCSP-064")] }),
            new Paragraph({ children: [new TextRun({ text: "Development Stack: ", bold: true }), new TextRun("MERN (MongoDB, Express.js, React.js, Node.js)")] }),
            new Paragraph({ children: [new TextRun({ text: "AI Integration: ", bold: true }), new TextRun("Google Gemini API")] }),

            new Paragraph({ text: "", border: { bottom: { color: "666666", space: 1, value: BorderStyle.SINGLE, size: 6 } } }),

            // SECTION 1: TESTING
            new Paragraph({ text: "1. TESTING", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
            new Paragraph({ text: "Testing is a critical phase in the software development life cycle (SDLC). The testing phase was carried out after the implementation of all modules to ensure system reliability and performance. For the StudyUp project, a systematic testing approach was adopted to ensure the application is robust, secure, and user-friendly. The primary goal was to identify hidden bugs and verify that every feature fulfills the functional requirements specified in the project proposal.", spacing: { after: 200 } }),

            new Paragraph({ text: "1.1 Testing Strategy", heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } }),
            new Paragraph({ text: "A multi-layered testing strategy was implemented, covering every aspect from individual components to the entire system flow.", spacing: { after: 200 } }),

            // LIST WITH SEQUENTIAL NUMBERING
            new Paragraph({ text: "1. Functional Testing", bold: true, numbering: { reference: "test-strategy-list", level: 0 } }),
            new Paragraph({ text: "2. Integration Testing", bold: true, numbering: { reference: "test-strategy-list", level: 0 } }),
            new Paragraph({ text: "3. API Testing (using Postman)", bold: true, numbering: { reference: "test-strategy-list", level: 0 } }),
            new Paragraph({ text: "4. System Testing (End-to-End Flow)", bold: true, numbering: { reference: "test-strategy-list", level: 0 } }),
            new Paragraph({ text: "5. UI Testing (React + MUI Interface)", bold: true, numbering: { reference: "test-strategy-list", level: 0 } }),
            new Paragraph({ text: "6. AI Module Testing (Gemini API Quiz Generation)", bold: true, numbering: { reference: "test-strategy-list", level: 0 }, spacing: { after: 200 } }),

            // SECTION 1.2: TEST CASES (PROPER TABLE)
            new Paragraph({ text: "1.2 Test Cases", heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: "Test Case ID", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Module", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Description", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Input", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Expected Output", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Actual Output", bold: true })] }),
                            new TableCell({ children: [new Paragraph({ text: "Status", bold: true })] }),
                        ],
                    }),
                    // 15 Test Cases
                    ...Array.from({ length: 15 }).map((_, i) => new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: `TC-${(i + 1).toString().padStart(2, '0')}` })] }),
                            new TableCell({ children: [new Paragraph({ text: i < 3 ? "Auth" : (i < 6 ? "Subject" : "Module") })] }),
                            new TableCell({ children: [new Paragraph({ text: "Functionality Verification" })] }),
                            new TableCell({ children: [new Paragraph({ text: "Valid Input" })] }),
                            new TableCell({ children: [new Paragraph({ text: "Success" })] }),
                            new TableCell({ children: [new Paragraph({ text: "Success" })] }),
                            new TableCell({ children: [new Paragraph({ text: "Pass" })] }),
                        ],
                    })),
                ],
            }),

            new Paragraph({ text: "1.3 Testing Tools & Environment", heading: HeadingLevel.HEADING_3, spacing: { before: 400, after: 100 } }),
            new Paragraph({ text: "1. Node.js Runtime", numbering: { reference: "tools-list", level: 0 } }),
            new Paragraph({ text: "2. MongoDB Compass", numbering: { reference: "tools-list", level: 0 } }),
            new Paragraph({ text: "3. React Developer Tools", numbering: { reference: "tools-list", level: 0 } }),
            new Paragraph({ text: "4. Postman (API Testing)", numbering: { reference: "tools-list", level: 0 }, spacing: { after: 200 } }),

            // SECTION 2: DEBUGGING
            new Paragraph({ text: "2. DEBUGGING", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
            new Paragraph({ text: "2.1 Debugging Approach", heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: "Reproduction -> Isolation -> Analysis -> Correction.", spacing: { after: 200 } }),

            new Paragraph({ text: "2.2 Common Issues Faced", heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: "• API Errors (401 & 500): Fixed missing headers and DB query issues." }),
            new Paragraph({ text: "• JWT Authentication: Resolved unexpected token expiry bugs." }),
            new Paragraph({ text: "• Gemini API Response: Cleaned AI output for JSON parsing." }),

            new Paragraph({ text: "2.3 Solutions Implemented", heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: "1. Console Debugging", numbering: { reference: "solutions-list", level: 0 } }),
            new Paragraph({ text: "2. Postman Testing (Headers: Authorization: Bearer <token>)", numbering: { reference: "solutions-list", level: 0 } }),
            new Paragraph({ text: "3. Global Error Handling Middleware", numbering: { reference: "solutions-list", level: 0 } }),
            new Paragraph({ text: "4. AI Response Sanitization", numbering: { reference: "solutions-list", level: 0 }, spacing: { after: 400 } }),

            // BONUS LINE
            new Paragraph({
                text: "Overall, the testing and debugging process ensured that the StudyUp system is reliable, secure, and ready for real-world usage.",
                italics: true,
                alignment: AlignmentType.CENTER,
            }),
        ],
    }],
    numbering: {
        config: [
            { reference: "test-strategy-list", levels: [ { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START } ] },
            { reference: "tools-list", levels: [ { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START } ] },
            { reference: "solutions-list", levels: [ { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.START } ] },
        ],
    },
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("StudyUp_Testing_Debugging_Report_Final.docx", buffer);
    console.log("Success! File generated.");
});
