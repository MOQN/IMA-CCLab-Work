const RESPONSIVE_BREAKPOINT = 900;
const MIN_RADIAL_DISTANCE = 300;
const MAX_RADIAL_DISTANCE = 550;

let tables = [];

function preload() {
  tables.push(loadTable('section-all.csv', 'csv'));
}

function setup() {
  noCanvas();

  const itemsArray = [];

  tables.forEach((table) => {
    // parse and create "creature" items.
    for (let r = 0; r < table.getRowCount(); r++) {
      const name = table.get(r, 0);
      const remark = table.get(r, 1);
      const link = table.get(r, 2);
      itemsArray.push({ name, remark, link });
    }
  });

  // shuffle the items array randomly
  itemsArray.sort(() => Math.random() - 0.5);

  // create items from the shuffled array
  itemsArray.forEach((item) => {
    createItem(item.name, item.remark, item.link);
  });

  // then, apply rotation to each item.
  applyRotation();

  // add additional effects :D
  applyRandomHoverColor();
  rotateByScrolling();
}

function draw() {
  noLoop();
}

function createItem(name, remark, link) {
  const div = document.createElement('div');
  div.classList.add('creature-item');
  const container = document.querySelector('.creature-container');
  container.appendChild(div);

  const spacer = document.createElement('div');
  spacer.classList.add('spacer');
  spacer.style.width = `${floor(random(30, 150))}px`;
  div.appendChild(spacer);

  const h3 = document.createElement('h3');
  h3.textContent = name;
  h3.addEventListener('click', () => {
    window.open(link, 'Project');
  });
  div.appendChild(h3);

  const p = document.createElement('p');
  p.textContent = remark;
  div.appendChild(p);
}

function applyRotation() {
  const items = document.querySelectorAll('.creature-item');
  if (window.innerWidth >= RESPONSIVE_BREAKPOINT) {
    document.body.style.overflow = 'hidden';
    items.forEach((item, i) => {
      const angle = (360 / items.length) * i;
      // map the radial distance based on the window width.
      radialDistance = floor(map(window.innerWidth, RESPONSIVE_BREAKPOINT, RESPONSIVE_BREAKPOINT + 200, MIN_RADIAL_DISTANCE, MAX_RADIAL_DISTANCE, true));
      item.style.transform = `rotate(${angle}deg) translate(${radialDistance}px)`;
    });
    // get creature-container-rotator and title-container and change the left position
    let xOriginPosition = floor(map(window.innerWidth, RESPONSIVE_BREAKPOINT, RESPONSIVE_BREAKPOINT + 200, 30, 22, true));
    xOriginPosition.toFixed(2); // I am not sure this would be useful.
    const container = document.querySelector('.creature-container-rotator');
    const title = document.querySelector('.title-container');
    title.style.left = `${xOriginPosition}vw`;
    container.style.left = `${xOriginPosition}vw`;
  } else {
    // if window is smaller than "RESPONSIVE_BREAKPOINT", remove rotation.
    document.body.style.overflow = 'auto';
    const items = document.querySelectorAll('.creature-item');
    items.forEach((item) => {
      item.style.transform = 'none';
    });
  }
}

function applyRandomHoverColor() {
  // get h3 from each item, then apply random hover color to it.
  const items = document.querySelectorAll('.creature-item h3');

  items.forEach((item) => {
    item.addEventListener('mouseover', () => {
      item.style.backgroundColor = `hsl(${floor(random(0, 360))}, 100%, 50%)`;
      item.style.color = 'black';
    });
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = 'black';
      item.style.color = 'white';
    });
  });
}

function rotateByScrolling() {
  if (window.innerWidth >= RESPONSIVE_BREAKPOINT) {
    window.addEventListener('wheel', handleWheelEvent, { passive: false });
  } else {
    const container = document.querySelector('.creature-container-rotator');
    container.style.transform = 'none';
    window.removeEventListener('wheel', handleWheelEvent);
  }
}

let angle = 0;
function handleWheelEvent(event) {
  angle += floor(event.deltaY * 0.1);
  const container = document.querySelector('.creature-container-rotator');
  container.style.transform = `rotate(${angle}deg)`;
  event.preventDefault();
}

window.addEventListener('resize', () => {
  applyRotation();
  rotateByScrolling();
});