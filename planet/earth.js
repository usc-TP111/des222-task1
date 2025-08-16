document.querySelectorAll('.node').forEach(node => {
  node.addEventListener('click', () => {
    const device = node.dataset.device;
    const content = document.querySelector(`.content.${device}`);
    content.classList.toggle('active');
  });
});

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// Pulse the whole node
async function pulse(selector) {
  anime({
    targets: selector,
    scale: [1, 1.3],
    duration: 900,
    direction: "alternate",
    easing: "easeInOutSine",
    loop: true,
  });
}

anime({
  targets: ".bg",
    opacity: [0, 1],
    duration: 3000,
    easing: "easeInOutSine",
});

const nodes = document.querySelectorAll(".node");
nodes.forEach((node, index) => {
  const delay = index * 3000; // stagger activation by 1 second
  anime({
    targets: node,
    duration: 900,
    opacity: [0, 1],
    easing: "linear",
    delay: delay,
    complete: () => pulse(node),
  });
});

// Spin the layers in all nodes
anime({
  targets: ".layer-a",
  rotate: "360deg",
  duration: 4000,
  easing: "linear",
  loop: true,
});

anime({
  targets: ".layer-b",
  rotate: "-360deg",
  duration: 4000,
  easing: "linear",
  loop: true,
});

anime({
  targets: ".earthTexture",
  backgroundPositionX: ["0px", "2048px"], // use your real texture width
  duration: 60000,
  easing: "linear",
  loop: true,
});
