// create web audio api context
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
var oscillator1 = audioCtx.createOscillator();
var oscillator2 = audioCtx.createOscillator();

oscillator1.type = 'sine';
oscillator2.type = 'square';
oscillator1.connect(audioCtx.destination);
oscillator2.connect(audioCtx.destination);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function randint(low, high) {
  return Math.floor(Math.random()*((high-low)+1))+low;
}
const notes = [];
function qsort(a, low, high) {
  if (low === undefined) {
    low = 0;
    high = a.length - 1;
  }

  if (low >= high) {
    return;
  }

  const pivot = a[randint(low, high)];

  let i = low;
  let j = high;

  while (i <= j) {
      while (a[i] < pivot) {
          i += 1;
      }
      while (a[j] > pivot) {
          j -= 1;
      }
      if (i <= j) {
        notes.push([i, j, a.slice()]);
        let temp = a[i];
        a[i] = a[j];
        a[j] = temp;
        i += 1;
        j -= 1;
      }
  }
  qsort(a, low, j);
  qsort(a, i, high);
}

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function updateTable(arr, i1, i2) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth=1;
  for (let j=0; j < arr.length; j++) {
    ctx.moveTo(j*2, canvas.height);
    ctx.lineTo(j*2, canvas.height-arr[j]);
  }
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth=2;
  ctx.moveTo(i1*2, canvas.height);
  ctx.lineTo(i1*2, canvas.height-arr[i1]);
  ctx.moveTo(i2*2, canvas.height);
  ctx.lineTo(i2*2, canvas.height-arr[i2]);
  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";
  ctx.stroke();
}

function playback() {
  if (notes.length) {
    let [i, j, arr] = notes.shift();
    oscillator1.frequency.value = arr[i] * arr[i] / 4 + 100;
    oscillator2.frequency.value = arr[j] * arr[j] / 4 + 100;
    updateTable(arr, i, j);
    setTimeout(playback, 100);
  } else {
    oscillator1.stop();
    oscillator2.stop();
  }
}

const a = [];
for (let i=1; i<=100; i++) {
  a.push(i);
}
shuffle(a);
qsort(a);

oscillator1.start();
oscillator2.start();
playback();
