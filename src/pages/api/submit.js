import { Resend } from "resend";
import formidable from "formidable";
import fs from "fs";

// Multipart form data (the resume file) can't be parsed by Next's default
// JSON body parser, so we disable it and hand parsing off to formidable.
export const config = {
  api: {
    bodyParser: false,
  },
};

const resend = new Resend(process.env.RESEND_API_KEY);

function parseForm(req) {
  const form = formidable({ maxFileSize: 5 * 1024 * 1024 }); // 5MB
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// formidable v3 gives every field/file as an array; this just unwraps
// single values so the rest of the handler doesn't have to think about it.
function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.TO_EMAIL) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  try {
    const { fields, files } = await parseForm(req);

    const firstName = first(fields.firstName) || "";
    const middleName = first(fields.middleName) || "";
    const lastName = first(fields.lastName) || "";
    const email = first(fields.email) || "";
    const gender = first(fields.gender) || "";
    const relocate = first(fields.relocate) ? "Yes" : "No";
    const workExperience = first(fields.workExperience) || "";
    const platform = first(fields.platform) || "";
    const programming = [].concat(fields.programming || []).join(", ");

    const resumeFile = first(files.resume);

    const attachments = [];
    if (resumeFile && resumeFile.filepath) {
      const buffer = fs.readFileSync(resumeFile.filepath);
      attachments.push({
        filename: resumeFile.originalFilename || "resume",
        content: buffer,
      });
    }

    const htmlBody = `
      <h2>New Job Application</h2>
      <p><strong>Name:</strong> ${firstName} ${middleName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Gender:</strong> ${gender}</p>
      <p><strong>Willing to relocate:</strong> ${relocate}</p>
      <p><strong>Work Experience:</strong> ${workExperience}</p>
      <p><strong>Favorite Platform:</strong> ${platform}</p>
      <p><strong>Programming Languages:</strong> ${programming}</p>
    `;

    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.TO_EMAIL,
      replyTo: email || undefined,
      subject: `New Application: ${firstName} ${lastName}`,
      html: htmlBody,
      attachments,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ error: "Failed to send application email." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Submit handler error:", err);
    return res.status(500).json({ error: "Unable to process your application." });
  }
}
