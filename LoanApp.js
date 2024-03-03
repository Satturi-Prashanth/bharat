const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3009;

async function findAvailablePort(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port);
    server.on('listening', () => {
      server.close(() => {
        resolve(port);
      });
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(findAvailablePort(port + 1));
      } else {
        reject(err);
      }
    });
  });
}

async function connectToLoanDatabase() {
  try {
    // await mongoose.connect('mongodb://localhost:27017/LoanApplication', { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connect('mongodb://mongodb-container:27017/LoanApplication', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Loan Database');
  } catch (error) {
    console.error('Error connecting to Loan Database:', error);
    process.exit(1);
  }
}

const registrationSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  FatherName: String,
  gender: String,
  CompanyName: String,
  password: String,
  EmpID: Number,
  Designation: String,
  phone: Number,
  email: String,
  LoanAmount: Number,
  ApplicationStatus: { type: String, default: 'UnderReview' },
});

const Registration = mongoose.model('Registration', registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', async (req, res) => {
  // ... (your existing code for loan application submission)
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.post('/register_submit', async (req, res) => {
  try {
    const registrationDetails = req.body;
    const existingUser = await Registration.findOne({ email: registrationDetails.email });

    if (existingUser) {
      res.status(400).send(`Error: Email '${registrationDetails.email}' already exists. Please check your input.`);
    } else {
      const newRegistration = new Registration(registrationDetails);
      await newRegistration.save();


      console.log('Registration data saved successfully:', newRegistration);

      res.send(`
        <html>
          <head>
            <meta http-equiv="refresh" content="3;url=/login">
          </head>
      
          </style>
          <body>
          
            <div style="text-align: center; margin-top: 50px;">
              <p style="font-weight: bold; font-size: larger;">You have successfully registered!</p>
              <p>Redirecting to <a href="/login">login</a>...</p>
            </div>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error saving registration data:', error);
    res.status(500).send('Error saving registration data.');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});


app.post('/login_submit', async (req, res) => {
  try {
    const { email, password } = req.body; // Change username to email
    console.log('Login attempt for email:', email);

    const user = await Registration.findOne({ email: email, password: password }); // Update username to email

    console.log('User:', user);

    if (user) {
      res.send(`
        <html>
          <head>
            <title>Login Success</title>
          </head>
          <body>
            <div style="text-align: center; margin-top: 50px;">
              <p style="font-weight: bold; font-size: larger;">Welcome, ${user.FirstName}!</p>
              <p>Your application is under review. We will contact you for the next steps.</p>
            </div>
          </body>
        </html>
      `);
    } else {
      console.log('Invalid credentials. Please try again.');
      res.send(`
        <html>
          <head>
            <title>Login Failed</title>
          </head>
          <body>
            <div style="text-align: center; margin-top: 50px; color: red;">
              <p style="font-weight: bold; font-size: larger;">Invalid credentials. Please try again.</p>
            </div>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send(`
      <html>
        <head>
          <title>Login Error</title>
        </head>
        <body>
          <div style="text-align: center; margin-top: 50px; color: red;">
            <p style="font-weight: bold; font-size: larger;">Error during login. Please try again.</p>
          </div>
        </body>
      </html>
    `);
  }
});

// ... (your existing code)

// app.post('/login_submit', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     console.log('Login attempt for username:', username);

//     const user = await Registration.findOne({ email: username, password: password });

//     console.log('User:', user);

//     if (user) {
//       res.send(`
//         <div style="text-align: center; margin-top: 50px;">
//           <p style="font-weight: bold; font-size: larger;">Welcome, ${user.FirstName}!</p>
//           <p>Your application is under review. We will contact you for the next steps.</p>
//         </div>
//       `);
//     } else {
//       console.log('Invalid credentials. Please try again.');
//       res.send(`
//         <div style="text-align: center; margin-top: 50px; color: red;">
//           <p style="font-weight: bold; font-size: larger;">Invalid credentials. Please try again.</p>
//         </div>
//       `);
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).send('Error during login.');
//   }
// });

// ... (your existing code)




app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/contact.html');
});

// Your existing routes...



async function startLoanServer() {
  const availablePort = await findAvailablePort(PORT);
  await connectToLoanDatabase();
  app.listen(availablePort, () => {
    console.log(`Loan Application Server is running on http://localhost:${availablePort}`);
  });
}

startLoanServer();

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Loan Database disconnected through app termination');
    process.exit(0);
  });
});
