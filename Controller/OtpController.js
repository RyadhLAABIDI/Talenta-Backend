import Otp from "../Models/Otpmodel.js";
import nodemailer from 'nodemailer';

// Function to generate a random OTP
function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export async function addOtp(req, res) {
  console.log('Request received:', req.body); // Ajoutez cette ligne

  const otpCode = generateOTP();

  const tr = new Otp({
    email: req.body.email,
    otp_code: otpCode,
  });

  try {
    await tr.save();
    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mtest7632@gmail.com',
        pass: 'golv xtao chzu qezz', // Use an App Password if two-factor authentication is enabled
      },
    });
    

    const mailOptions = {
      from: 'mtest7632@gmail.com',
      to: req.body.email,
      subject: 'OTP Code',
      text: `Your OTP code is: ${otpCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).send({
      message: otpCode,
    });
  } catch (err) {
    console.error('Error:', err); // Ajoutez cette ligne
    res.status(500).send({ error: err });
  }
}

export async function getAllOtp(req, res) {
    Otp.find().then(tr => {
        res.status(200).send(tr)
    }).catch(err => {
        res.status(500).send(err)
    })
}

export async function verifyOtp(req, res) {
  try {
    const otp = req.body.otp;

    const existingOtp = await Otp.findOne({ otp_code: otp });

    if (existingOtp) {
      res.status(200).send({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).send({ success: false, message: 'Invalid OTP. Please enter a valid OTP.' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({ success: false, message: 'Failed to verify OTP. Please try again later.' });
  }
}
