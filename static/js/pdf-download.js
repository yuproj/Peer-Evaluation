// PDF Download functionality for reports
function downloadReportPDF() {
    const report = window.currentReport;
    if (!report) {
        showToast('No report to download', 'error');
        return;
    }

    // Safely access nested data
    const student = report.student || {};
    const assignment = report.assignment || {};
    const teamEvals = report.team_evaluations || [];
    const memberEvals = report.member_evaluations || [];
    
    const teamName = (student.team && typeof student.team === 'object') ? student.team.name : 'Unknown Team';
    const className = (student.class && typeof student.class === 'object') ? student.class.name : 'Unknown Class';

    // Create HTML content for PDF
    let htmlContent = `
        <html>
        <head>
            <title>Peer Evaluation Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
                h2 { color: #34495e; margin-top: 25px; margin-bottom: 15px; }
                .info-section { margin: 15px 0; background: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; border-radius: 4px; }
                .evaluation-card { margin: 15px 0; padding: 12px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; }
                .score { font-weight: bold; color: #27ae60; font-size: 1.1em; }
                strong { color: #2c3e50; }
                p { margin: 8px 0; }
                .summary { background: #d5f4e6; padding: 15px; border-radius: 5px; margin: 20px 0; }
                .summary h3 { margin-top: 0; color: #27ae60; }
                .footer { text-align: center; color: #999; font-size: 11px; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; }
            </style>
        </head>
        <body>
            <h1>Peer Evaluation Report</h1>
            
            <div class="info-section">
                <p><strong>Student Name:</strong> ${student.name || 'Unknown'}</p>
                <p><strong>Class:</strong> ${className}</p>
                <p><strong>Team:</strong> ${teamName}</p>
                <p><strong>Assignment:</strong> ${assignment.name || 'Unknown'}</p>
                <p><strong>Evaluation Period:</strong> ${formatDate(assignment.start_time)} - ${formatDate(assignment.end_time)}</p>
            </div>

            <h2>Team Evaluations Received</h2>
            ${teamEvals.length === 0 ? 
                '<p><em>No team evaluations received.</em></p>' : 
                teamEvals.map(teamEval => {
                    const evaluator = teamEval.evaluator || {};
                    return `
                        <div class="evaluation-card">
                            <p><strong>Score:</strong> <span class="score">${teamEval.team_score || 'N/A'}/10</span></p>
                            <p><strong>Comment:</strong> ${teamEval.team_comment || 'No comment provided'}</p>
                        </div>
                    `;
                }).join('')
            }

            <h2>Individual Evaluations Received</h2>
            ${memberEvals.length === 0 ? 
                '<p><em>No individual evaluations received.</em></p>' :
                memberEvals.map(memberEval => {
                    const teamEval = memberEval.team_evaluation || {};
                    const evaluator = teamEval.evaluator || {};
                    return `
                        <div class="evaluation-card">
                            <p><strong>Score:</strong> <span class="score">${memberEval.score || 'N/A'}/10</span></p>
                            <p><strong>Comment:</strong> ${memberEval.comment || 'No comment provided'}</p>
                        </div>
                    `;
                }).join('')
            }

            <div class="summary">
                <h3>📊 Summary Statistics</h3>
                <p><strong>Total Team Evaluations:</strong> ${teamEvals.length}</p>
                <p><strong>Total Individual Evaluations:</strong> ${memberEvals.length}</p>
                ${teamEvals.length > 0 ? `
                    <p><strong>Average Team Score:</strong> ${(teamEvals.reduce((sum, e) => sum + (e.team_score || 0), 0) / teamEvals.length).toFixed(1)}/10</p>
                ` : ''}
                ${memberEvals.length > 0 ? `
                    <p><strong>Average Individual Score:</strong> ${(memberEvals.reduce((sum, e) => sum + (e.score || 0), 0) / memberEvals.length).toFixed(1)}/10</p>
                ` : ''}
            </div>

            <div class="footer">
                <p>Generated on ${new Date().toLocaleString()}</p>
                <p>Peer Evaluation Platform</p>
            </div>
        </body>
        </html>
    `;

    // Create a new window/tab with the content
    const pdfWindow = window.open('', '', 'height=600,width=800');
    if (!pdfWindow) {
        showToast('Could not open print dialog. Please check your popup blocker.', 'error');
        return;
    }
    
    pdfWindow.document.write(htmlContent);
    pdfWindow.document.close();

    // Trigger print dialog (which allows saving as PDF)
    setTimeout(() => {
        pdfWindow.print();
        // Optionally close the window after printing
        // setTimeout(() => pdfWindow.close(), 1000);
    }, 250);
}
