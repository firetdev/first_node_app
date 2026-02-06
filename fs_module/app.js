// Example of file system

// EXPECTED BEHAVIOR:
// Creates 2 files, appends data to them, reads their contents, and then deletes them.

import fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';

// Initially create and write to file
fs.writeFile('message.txt', 'Initial data\n', err => {
  if (err) {
    console.error(err);
  } else {
    console.log('File created and data written successfully.');

    // Append data to the file. This is inside the previous function because they're asynchronous.
    fs.appendFile('message.txt', 'data to append\n', (err) => {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');

      // Append data to the file again to demonstrate multiple appends
      fs.appendFile('message.txt', 'data to append\n', (err) => {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');

        // Read the file after all writes are done
        readFile1();
      }); 
    });
  }
});

// Example using promises
// Promises allow us to not have to chain callbacks
async function writeFile2() {
  try {
    await fsPromises.writeFile('message2.txt', 'Initial data\n');
    console.log('File 2 created and initial data written successfully.');

    await fsPromises.appendFile('message2.txt', 'data to append\n');
    console.log('The "data to append" was appended to file 2!');

    await fsPromises.appendFile('message2.txt', 'data to append\n')
      .then(() => {
        readFile2()  // So the file is read after all writes are done
          .then(() => {
            deleteFile2();  // So the file is deleted after reading
          });
      });
    console.log('The "data to append" was appended to file 2!');
  } catch (err) {
    console.error('An error occurred during file operations:', err);
  }
}

writeFile2();

// Create a read stream
// I haven't yet learned streams, so I don't do anything with it, but it's here for reference
const stream = fs.createReadStream('message.txt', () => {
  stream.close();
});

// Reading files (using callback and then promises)
function readFile1() {
  fs.readFile('message.txt', (err, data) => {
    if (err) throw err;
    console.log(`Message 1 contents: \n${data}`);

    // Delete the file after reading
    deleteFile1();
  });
}

async function readFile2() {
  try {
    const data = await fsPromises.readFile('message2.txt');
    console.log(`Message 2 contents: \n${data}`);
  } catch (err) {
    console.error('An error occurred while reading file 2:', err);
  }
}

// Delete the files
// Callback API
function deleteFile1() {
  fs.unlink('message.txt', (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.log('File not found');
      } else {
        console.error(err);
      }
      return;
    }
    console.log('message.txt was deleted successfully.');
  });
}

// Promise API
async function deleteFile2() {
  try {
    await fsPromises.unlink('message2.txt');
    console.log('message2.txt was deleted successfully.');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File not found');
    } else {
      console.error(err);
    }
  }
}