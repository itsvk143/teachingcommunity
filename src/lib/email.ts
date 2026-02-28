import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface VacancyData {
    jobTitle: string;
    companyName: string;
    vacancyCategory?: string;
    city?: string;
    state?: string;
    location?: string;
    jobType?: string;
    salary?: string;
    experience?: string;
    description?: string;
}

export async function sendVacancyNotificationEmail(vacancy: VacancyData, recipientEmails: string[]) {
    if (!recipientEmails || recipientEmails.length === 0) return;

    const subject = `New Vacancy Posted: ${vacancy.jobTitle} at ${vacancy.companyName}`;
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #2563eb;">New Vacancy Opportunity!</h2>
      <p>A new ${vacancy.vacancyCategory} vacancy has been posted that might interest you.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e40af;">${vacancy.jobTitle}</h3>
        <p><strong>Institute/Company:</strong> ${vacancy.companyName}</p>
        <p><strong>Location:</strong> ${vacancy.city ? vacancy.city + ', ' : ''}${vacancy.state || vacancy.location}</p>
        <p><strong>Job Type:</strong> ${vacancy.jobType}</p>
        ${vacancy.salary ? `<p><strong>Salary:</strong> ${vacancy.salary}</p>` : ''}
        ${vacancy.experience ? `<p><strong>Experience Required:</strong> ${vacancy.experience}</p>` : ''}
        
        <div style="margin-top: 15px;">
          <strong>Description:</strong>
          <p style="white-space: pre-wrap;">${vacancy.description}</p>
        </div>
      </div>
      
      <p>Login to your portal to view more details and apply.</p>
      <br/>
      <p>Best Regards,</p>
      <p><strong>Teaching Community Team</strong></p>
    </div>
  `;

    // Gmail has a limit on recipients per email, typically 500. 
    // We chunk by 100 to be safe.
    const chunkSize = 100;

    for (let i = 0; i < recipientEmails.length; i += chunkSize) {
        const chunk = recipientEmails.slice(i, i + chunkSize);

        const mailOptions = {
            from: `"Teaching Community" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            bcc: chunk, // Hide recipients from each other
            subject,
            html: htmlContent,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Sent vacancy notification chunk to ${chunk.length} recipients.`);
        } catch (error) {
            console.error('Error sending vacancy notification chunk:', error);
        }
    }
}
