import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD_MAIL,
  },
});

const sendMail = async (mail, code) => {
  const mailOptions = {
    from: process.env.MAIL,
    to: mail,
    subject: `احراز هویت در نمالینک`,
    html: `کد احراز شما : ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("Mail error:", err.message);
    return false;
  }
};

export default sendMail;
