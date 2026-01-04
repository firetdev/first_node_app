// Just for reference

import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question(`What's your name? `, name => {
  console.log(`Hi ${name}!`);
    // This fully closes the interface, if you want to use input again later you'll either have to create
    // a new one or just don't close this one until the program exits
  rl.close();
});