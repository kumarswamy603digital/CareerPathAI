import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface AssessmentData {
  recommended_career: string;
  personality: string[];
  interests: string[];
  completed_at: string;
}

export const exportCareerRecommendationsPdf = (
  assessments: AssessmentData[],
  userEmail?: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Career Recommendations', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Subtitle with date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, yPosition, { align: 'center' });
  if (userEmail) {
    yPosition += 5;
    doc.text(`For: ${userEmail}`, pageWidth / 2, yPosition, { align: 'center' });
  }
  yPosition += 15;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  doc.setTextColor(0, 0, 0);

  assessments.forEach((assessment, index) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Assessment header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const label = index === 0 ? ' (Current)' : '';
    doc.text(`${assessment.recommended_career}${label}`, margin, yPosition);
    yPosition += 6;

    // Date
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Completed: ${format(new Date(assessment.completed_at), 'MMMM d, yyyy')}`, margin, yPosition);
    yPosition += 10;

    doc.setTextColor(0, 0, 0);

    // Personality Types
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Personality Types:', margin, yPosition);
    yPosition += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const personalityText = assessment.personality.join(', ');
    const personalityLines = doc.splitTextToSize(personalityText, pageWidth - margin * 2);
    doc.text(personalityLines, margin, yPosition);
    yPosition += personalityLines.length * 5 + 6;

    // Interests
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Interests:', margin, yPosition);
    yPosition += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const interestsText = assessment.interests.join(', ');
    const interestsLines = doc.splitTextToSize(interestsText, pageWidth - margin * 2);
    doc.text(interestsLines, margin, yPosition);
    yPosition += interestsLines.length * 5 + 10;

    // Separator between assessments
    if (index < assessments.length - 1) {
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
    }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `CareerPath - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`career-recommendations-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
