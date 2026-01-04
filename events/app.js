import EventEmitter from 'node:events';
import readline from 'node:readline';

const eventEmitter = new EventEmitter();

eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`What should the number be? `, myNum => {
  eventEmitter.emit('start', Number(myNum));
  rl.close();
});