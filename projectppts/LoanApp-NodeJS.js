const readline = require('readline');//reads input from the user via the command line.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });//standard input stream
//This line creates a new readline interface using the createInterface method. 
const askQuestion = (question, validateFunc) => new Promise((resolve, reject) => {
  rl.question(question, (answer) => {
    if (answer.trim() === '') reject('Input cannot be empty.');//This line checks if the user's input is empty
    else if (validateFunc && !validateFunc(answer.trim())) reject('Invalid input.');
    else resolve(answer.trim());
  });
});
//object which will be resolved with the user's input if it is valid, or rejected with an error message if it is not.

const validateName = (name) => /^[a-zA-Z]+$/.test(name);//This line defines a regular expression that matches strings containing only uppercase or lowercase letters.
const validateID = (id) => /^[a-zA-Z0-9]+$/.test(id);//expression that matches strings containing only uppercase or lowercase letters and/or digits.
const validateAmount = (amount) => /^\d+(\.\d{1,2})?$/.test(amount);//positive decimal numbers with up to two decimal places

console.log("Welcome to the Loan Application Login");
console.log("--------------------------------------");
askQuestion('Enter your First Name: ', validateName)//This line calls the askQuestion function with the prompt string and validation function for the user's first name input. 
  .then((firstName) => askQuestion('Enter your Last Name: ', validateName).then((lastName) => [firstName, lastName]))//.then method to chain the different prompts together so that the user can enter their information step-by-step.
  .then(([firstName, lastName]) => askQuestion('Enter your Father Name: ', validateName).then((fatherName) => [firstName, lastName, fatherName]))
  .then(([firstName, lastName, fatherName]) => askQuestion('Enter your Company Name: ', validateName).then((companyName) => [firstName, lastName, fatherName, companyName]))
  .then(([firstName, lastName, fatherName, companyName]) => askQuestion('Enter your ID Number: ', validateID).then((idNumber) => [firstName, lastName, fatherName, companyName, idNumber]))
  .then(([firstName, lastName, fatherName, companyName, idNumber]) => askQuestion('Enter your Designation: ', validateName).then((designation) => [firstName, lastName, fatherName, companyName, idNumber, designation]))
  .then(([firstName, lastName, fatherName, companyName, idNumber, designation]) => askQuestion('Enter Loan Amount: ', validateAmount).then((loanAmount) => [firstName, lastName, fatherName, companyName, idNumber, designation, loanAmount]))
  .then(([firstName, lastName, fatherName, companyName, idNumber, designation, loanAmount]) => {
    console.log(`Here is your information : \n First Name:${firstName} \n Last Name: ${lastName} \n Father Name: ${fatherName} \n Company Name: ${companyName} \n ID Number: ${idNumber} \n Designation: ${designation} \n Loan Amount: ${loanAmount}`);
    console.log("--------------------------------------");
    console.log("Thank you and visit again");
    rl.close();//This line calls the close method of the readline interface to close the interface 
  })
  .catch((error) => {
    console.error(error);
    rl.close();
  });//This method will be called if any of the previous promises is rejected,