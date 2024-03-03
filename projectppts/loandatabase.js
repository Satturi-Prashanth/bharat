const readline = require('readline');
const { MongoClient } = require('mongodb');
 
const url = "mongodb://localhost:27017";
const dbName = 'LoanApplicatrion';
const collectionName = 'users';
 
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
 
async function main() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
 
  try {
    await client.connect();
    console.log('Connected to MongoDB');
 
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
 
    const userData = await getUserData();
 
    await collection.insertOne(userData);
    console.log('Thanks for applying!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    rl.close();
  }
}
 
async function getUserData() {
  const FirstName = await askQuestion('Enter your First Name: ');
  const LastName = await askQuestion('Enter your Last Name: ');
  const FatherName = await askQuestion('Enter your Father Name: ');
  const EmpID = await askQuestion('Enter your EmpID: ');
  const CompanyName = await askQuestion('Enter your CompanyName: ');
  const Designation = await askQuestion('Enter your  Designation: ');
  const LoanAmount = await askQuestion('Enter your LoanAmount: ');
 
  return {
    FirstName,
    LastName,
    FatherName,
    EmpID,
    CompanyName,
    Designation,
    LoanAmount
    
  };
}
 
function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}
 
main();