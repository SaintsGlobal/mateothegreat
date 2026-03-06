const brandColors = {
  coral: "#FF7593",
  cyan: "#4CC2D5",
  dark: "#0a0a0a",
  darkAlt: "#1a1a1a",
  white: "#ffffff",
  gray: "#BCBCBC",
};

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: ${brandColors.dark};
  color: ${brandColors.white};
  padding: 40px 20px;
`;

const containerStyles = `
  max-width: 600px;
  margin: 0 auto;
  background-color: ${brandColors.darkAlt};
  border-radius: 8px;
  padding: 40px;
`;

const headingStyles = `
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: ${brandColors.coral};
`;

const textStyles = `
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 16px 0;
  color: ${brandColors.white};
`;

const buttonStyles = `
  display: inline-block;
  background-color: ${brandColors.coral};
  color: ${brandColors.white};
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  margin: 20px 0;
`;

const footerStyles = `
  font-size: 14px;
  color: ${brandColors.gray};
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid ${brandColors.gray}33;
`;

export function welcomeEmail(): { subject: string; html: string } {
  return {
    subject: "Welcome to Mateo The Great!",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="${baseStyles}">
  <div style="${containerStyles}">
    <h1 style="${headingStyles}">Welcome to Mateo The Great!</h1>
    <p style="${textStyles}">
      Thanks for subscribing to our newsletter. You're now part of a community
      exploring AI insights and the latest in technology.
    </p>
    <p style="${textStyles}">
      Stay tuned for exclusive content, updates, and more delivered straight
      to your inbox.
    </p>
    <p style="${footerStyles}">
      &copy; ${new Date().getFullYear()} MTG Intellectual Reserve, LLC
    </p>
  </div>
</body>
</html>
    `.trim(),
  };
}

export function verificationEmail(token: string): { subject: string; html: string } {
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${token}`;

  return {
    subject: "Verify your email - Mateo The Great",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="${baseStyles}">
  <div style="${containerStyles}">
    <h1 style="${headingStyles}">Verify Your Email</h1>
    <p style="${textStyles}">
      Thanks for signing up! Please click the button below to verify your email address.
    </p>
    <a href="${verifyUrl}" style="${buttonStyles}">Verify Email</a>
    <p style="${textStyles}">
      If you didn't create an account, you can safely ignore this email.
    </p>
    <p style="${footerStyles}">
      &copy; ${new Date().getFullYear()} MTG Intellectual Reserve, LLC
    </p>
  </div>
</body>
</html>
    `.trim(),
  };
}

export function passwordResetEmail(token: string): { subject: string; html: string } {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

  return {
    subject: "Reset your password - Mateo The Great",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="${baseStyles}">
  <div style="${containerStyles}">
    <h1 style="${headingStyles}">Reset Your Password</h1>
    <p style="${textStyles}">
      We received a request to reset your password. Click the button below to choose a new password.
    </p>
    <a href="${resetUrl}" style="${buttonStyles}">Reset Password</a>
    <p style="${textStyles}">
      This link will expire in 1 hour. If you didn't request a password reset,
      you can safely ignore this email.
    </p>
    <p style="${footerStyles}">
      &copy; ${new Date().getFullYear()} MTG Intellectual Reserve, LLC
    </p>
  </div>
</body>
</html>
    `.trim(),
  };
}
