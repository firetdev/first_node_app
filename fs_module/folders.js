import fs from 'node:fs/promises';
import path from 'node:path';

const folderName = 'test';

const isFile = async filePath => {
  const stat = await fs.lstat(filePath);
  return stat.isFile();
};

async function setupFolder() {
  try {
    await fs.mkdir(folderName, { recursive: true });
  } catch (err) {
    console.error(err);
  }

  try {
    await fs.readdir(folderName);
  } catch (err) {
    console.error(err);
  }
}

async function getFilesInFolder(folderPath) {
  const files = await fs.readdir(folderPath);
  const fullPaths = files.map(f => path.join(folderPath, f));

  const isFileArray = await Promise.all(fullPaths.map(p => isFile(p)));

  return fullPaths.filter((p, i) => isFileArray[i]);
}

async function renameFolder(newName) {
  try {
    await fs.rename(folderName, newName);
  } catch (err) {
    console.log(err);
  }
}

async function deleteFolder(name) {
  try {
    await fs.rm(name, { recursive: true, force: true });
  } catch (err) {
    console.log(err);
  }
}

async function main() {
  await setupFolder();

  const files = await getFilesInFolder(folderName);
  console.log(files);

  await renameFolder('new_test');
  await deleteFolder('new_test');
}

main();