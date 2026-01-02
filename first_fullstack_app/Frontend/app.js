import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const endpoint = 'http://localhost:8080/api/createData';
const rl = readline.createInterface({ input, output });

let folderName = '';
let fileName = '';
let textContent = '';

async function askQuestions() {
  folderName = await rl.question('What is the folder name? ');
  fileName = await rl.question('What is the file name? ');
  textContent = await rl.question('What is the text content? ');

  rl.close();
}

async function sendRequest() {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        folderName,
        fileName,
        textContent
      })
    });

    const data = await response.json();
    console.log('Server responded with:', data);
  } catch (err) {
    console.error('Error sending request:', err);
  }
}

async function main() {
  await askQuestions();
  await sendRequest();
}

main();