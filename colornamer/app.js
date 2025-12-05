import Color from 'colorjs.io';
import http from 'node:http';

let mode = 'rgb';

http
  .createServer((request, response) => {
    mode = request.headers['mode'];
    const color = request.headers['color'];

    if (!mode || !color) {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      return response.end('Missing required headers: mode and/or color');
    }
    // Validate mode
    if (mode !== 'rgb' && mode !== 'lab') {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      return response.end('Invalid mode. Must be "rgb" or "lab"');
    }

    const rgb = color.split(',').map(x => parseInt(x.trim(), 10));

    const validRGB =
      rgb.length === 3 &&
      rgb.every(n => Number.isInteger(n) && n >= 0 && n <= 255);

    if (!validRGB) {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      return response.end('Invalid color. Must be "r,g,b" with values 0–255');
    }

    request.on('error', err => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on('error', err => {
      console.error(err);
    });

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({
      nearest: getNearestColor(color)
    }));
  })
  .listen(8080);

// Predefined colors
const colors = [
  [255,   0,   0],   // Red
  [255, 165,   0],   // Orange
  [255, 255,   0],   // Yellow
  [  0, 128,   0],   // Green
  [  0,   0, 255],   // Blue
  [ 75,   0, 130],   // Indigo
  [238, 130, 238],   // Violet
  [255, 255, 255],   // White
  [  0,   0,   0],   // Black
  [128, 128, 128],   // Gray
  [150,  75,   0]    // Brown
];

const colorNames = [
  'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo',
  'Violet', 'White', 'Black', 'Gray', 'Brown'
];

console.log('Mode:', mode);

const getNearestColor = (input) => {
  const newColor = input.split(',').map(x => parseInt(x.trim(), 10));

  // Convert to 0–1 for RGB math
  const newColorRGB = newColor.map(v => v / 255);
  const colorsRGB = colors.map(c => c.map(v => v / 255));

  let distances = [];

  if (mode === 'rgb') {
    // Euclidean distance in RGB
    distances = colorsRGB.map(c =>
      Math.sqrt(
        (c[0] - newColorRGB[0]) ** 2 +
        (c[1] - newColorRGB[1]) ** 2 +
        (c[2] - newColorRGB[2]) ** 2
      )
    );
  }
  else if (mode === 'lab') {
    // Convert both to Lab using colorjs.io
    const newLab = new Color('srgb', newColorRGB).to('lab').coords;

    distances = colorsRGB.map(rgb => {
      const lab = new Color('srgb', rgb).to('lab').coords;
      return Math.sqrt(
        (lab[0] - newLab[0]) ** 2 +
        (lab[1] - newLab[1]) ** 2 +
        (lab[2] - newLab[2]) ** 2
      );
    });
  }
  
  // Find closest
  const minIndex = distances.indexOf(Math.min(...distances));
  return colorNames[minIndex];
};