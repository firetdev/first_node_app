// To effectively create a 60fps loop
let i = 0;  // Iterations

const loop = setInterval(() => {
  i++;
  console.log(`iteration: ${i}`);
  if (i >= 1000) {
    clearInterval(loop);
  }
}, 1000 / 60);