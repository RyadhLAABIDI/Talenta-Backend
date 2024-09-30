import Test from "../Models/Testmodel.js";

// Function to generate a random OTP


export async function addTest(req, res) {
 // const otpCode = generateOTP();

  const tr = new Test({
    email: req.body.email,
    username: req.body.username,
  });

  try {
    await tr.save();
    res.status(201).send({
      message: otpCode,
    });


  } catch (err) {
    //res.status(500).send({ error: err });
  }
}

export async function getAllTests(req, res) {
    Test.find().then(tr => {
        res.status(200).send(tr)
    }).catch(err => {
        res.status(500).send(err)
    })
}





