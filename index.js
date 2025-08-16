// Prevent multiple click events
let earthClickable = false;

document.querySelector(".earthWrap").addEventListener("click", () => {
  if (!earthClickable) return;
  earthClickable = false;

  anime({
    targets: ".earthWrap",
    scale: [1, 6],
    duration: 2000,
    easing: "easeInOutQuad",
  });

  anime({
    targets: ".textWrap",
    opacity: [1, 0],
    duration: 500,
    easing: "easeInOutQuad",
  });
  
  anime({
    targets: "#clickPrompt",
    opacity: [1, 0],
    duration: 500,
    easing: "easeInOutQuad",
  });

  anime({
    targets: ".clouds",
    scale: [0, 2],
    opacity: [0, 1],
    duration: 2000,
    easing: "easeInOutQuad",
  }).finished.then(() => {
    // redirect when timeline is done
    window.location.href = "planet/earth.html";
  });
});

// Center point (in pixels) of an element
function centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// Update beam endpoints to connect node centers (convert to SVG viewBox units)
function positionBeams() {
  const svg = document.querySelector("svg.beams");
  const box = svg.getBoundingClientRect();
  const n1 = document.querySelector(".node1");
  const n2 = document.querySelector(".node2");
  const c1 = centerOf(n1);
  const c2 = centerOf(n2);

  const x1 = ((c1.x - box.left) / box.width) * 100;
  const y1 = ((c1.y - box.top) / box.height) * 100;
  const x2 = ((c2.x - box.left) / box.width) * 100;
  const y2 = ((c2.y - box.top) / box.height) * 100;

  const beamA = document.getElementById("beamA"); // node1 -> node2
  const beamB = document.getElementById("beamB"); // node2 -> node1
  beamA.setAttribute("x1", x1);
  beamA.setAttribute("y1", y1);
  beamA.setAttribute("x2", x2);
  beamA.setAttribute("y2", y2);
  beamB.setAttribute("x1", x2);
  beamB.setAttribute("y1", y2);
  beamB.setAttribute("x2", x1);
  beamB.setAttribute("y2", y1);

  // reset dash lengths to make "draw" animation correct after reposition
  [beamA, beamB].forEach((line) => {
    const len = line.getTotalLength();
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
  });
}

// Pulse the whole node
function pulse(selector) {
  anime({
    targets: selector,
    scale: [1, 1.3],
    duration: 900,
    direction: "alternate",
    easing: "easeInOutSine",
    loop: true,
  });
}

// Counter-rotate layers inside a node
function spinLayers(nodeSelector) {
  anime({
    targets: nodeSelector + " .layer-a",
    rotate: "360deg",
    duration: 4000,
    easing: "linear",
    loop: true,
  });

  anime({
    targets: nodeSelector + " .layer-b",
    rotate: "-360deg",
    duration: 4000,
    easing: "linear",
    loop: true,
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Fire rapid beams back & forth
async function startBeams() {
  await sleep(4000); // wait for nodes to stabilize
  positionBeams(); // ensure positioned before animating

  const beamA = document.getElementById("beamA");
  const beamB = document.getElementById("beamB");

  const lenA = beamA.getTotalLength();
  const lenB = beamB.getTotalLength();

  // A simple repeating timeline: A shoots, then B shoots, small gap, repeat
  const t = anime.timeline({ loop: 3 });

  t.add({
    targets: "#beamA",
    opacity: [{ value: 1, duration: 0 }],
    strokeDashoffset: [lenA, 0],
    duration: 140,
    easing: "linear",
  })
    .add({
      targets: "#beamA",
      opacity: [{ value: 0, duration: 120 }],
      duration: 140,
    })
    .add({
      targets: "#beamB",
      opacity: [{ value: 1, duration: 0 }],
      strokeDashoffset: [lenB, 0],
      duration: 140,
      easing: "linear",
    })
    .add({
      targets: "#beamB",
      opacity: [{ value: 0, duration: 60 }],
      duration: 0,
    })
    .add({
      // tiny pause between volleys
      duration: 800,
    });
}

// Typewriter for the 3-way handshake lines
async function typeHandshake() {
  await sleep(3500); // wait for beams to start

  const term = document.getElementById("term");
  const cursor = term.querySelector(".cursor");

  const lines = [
    "[12:02:14] NODE_A → NODE_B  SYN        seq=0x00001  port=1883  [MQTT handshake init]",
    "[12:02:14] NODE_B → NODE_A  SYN-ACK    seq=0x4F1A2  ack=0x00002",
    "[12:02:15] NODE_A → NODE_B  ACK        ack=0x4F1A3  [connection established]",
    "",
    "[12:02:15] NODE_A → NODE_B  AUTH_REQUEST   device_id=EARTH-23  key=***",
    "[12:02:15] NODE_B → NODE_A  AUTH_OK        session_id=91E7-12FA",
    "",
    '[12:02:16] MQTT CONNECT → topic="sensor/global"',
    "[12:02:16] SUBSCRIBE_ACK qos=1",
    "",
    "Link established. Awaiting data stream...",
  ];

  // typing parameters
  const charDelay = 4; // ms per character
  const linePause = 60; // pause between lines

  term.innerText = ""; // clear terminal content

  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      cursor.remove(); // move cursor to end
      term.append(document.createTextNode(line[i]));
      term.appendChild(cursor);
      await sleep(charDelay);
    }
    term.append(document.createTextNode("\n"));
    await sleep(linePause);
  }
}

async function revealBackground() {
  await sleep(1000); // wait for the beams to finish

  document.body.classList.add("bg-reveal");

  // Hide terminal
  anime({
    targets: ".terminal",
    opacity: [1, 0],
    duration: 2000,
    easing: "easeInOutQuad",
  });

  // Scale down earth + node ring
  anime({
    targets: ".earthWrap",
    scale: [4, 1],
    duration: 7000,
    easing: "easeInOutQuad",
  });

  // Scale down main nodes
  anime({
    targets: ".nodeWrap",
    scale: [1, 0.2],
    duration: 7000,
    easing: "easeInOutQuad",
  });

  // Reveal node ring
  anime({
    targets: ".nodeRing",
    opacity: [0, 1],
    duration: 4000,
    easing: "easeInOutQuad",
  });

  // Wait for 3s
  await sleep(3000);

  // Fade out nodes and ring
  anime({
    targets: ".nodeWrap",
    opacity: [1, 0],
    duration: 3000,
    easing: "easeInOutQuad",
  });

  anime({
    targets: ".nodeRing",
    opacity: [1, 0],
    duration: 4000,
    easing: "easeInOutQuad",
  });

  // Fade in earth texture
  anime({
    targets: ".earthTexture",
    opacity: [0, 1],
    duration: 4000,
    easing: "easeInOutQuad",
  });

  await sleep(4000);

  // Fade in text 1
  anime({
    targets: "#title1",
    opacity: [0, 1],
    duration: 2000,
    easing: "easeInOutQuad",
  });

  await sleep(4000);

  // Fade in text 2
  anime({
    targets: "#title2",
    opacity: [0, 1],
    duration: 2000,
    easing: "easeInOutQuad",
  });

  await sleep(2000); // Wait for text 2 to finish

  // Allow the user to click the earth
  earthClickable = true;
  document.querySelector(".earthWrap").style.cursor = "pointer";

  
  await sleep(2000); // Show click prompt

  // Fade in text 2
  anime({
    targets: "#clickPrompt",
    opacity: [0, 1],
    duration: 2000,
    easing: "easeInOutQuad",
  });
}

/* ----- Main Timeline ----- */
const tl = anime.timeline({ autoplay: true });

tl.add({
  targets: ".node1",
  opacity: [0, 1],
  scale: [0, 1],
  duration: 800,
  easing: "easeOutQuad",
  delay: 3000,
  begin: () => spinLayers(".node1"),
  complete: () => pulse(".node1"),
})
  .add({
    targets: ".node2",
    opacity: [0, 1],
    scale: [0, 1],
    duration: 800,
    easing: "easeOutQuad",
    delay: 3000,
    begin: () => spinLayers(".node2"),
    complete: () => pulse(".node2"),
  })
  .add({
    targets: ".terminal",
    opacity: [0, 1],
    begin: () => {
      positionBeams();
      startBeams();
      typeHandshake().then(revealBackground);
    },
  });

anime({
  targets: ".earthTexture",
  backgroundPositionX: ["0px", "2048px"],
  duration: 60000,
  easing: "linear",
  loop: true,
});

// keep beams aligned on resize/orientation change
window.addEventListener("resize", () => positionBeams());
window.addEventListener("orientationchange", () => positionBeams());
