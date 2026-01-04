import EventEmitter from 'node:events';
import readline from 'node:readline';

const eventEmitter = new EventEmitter();

eventEmitter.on('start', number => {
  console.log(`started ${number}`);
  multipleParams.emit('start', 1, 100);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`What should the number be? `, myNum => {
  eventEmitter.emit('start', Number(myNum));
  rl.close();
});

const multipleParams = new EventEmitter();

multipleParams.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});