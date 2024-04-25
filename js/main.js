const image = document.getElementById('map-pic');
const container = document.getElementById('map-container');
let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;
let scale = 1;

image.addEventListener('mousedown', startDrag);
document.addEventListener('mouseup', endDrag);
image.addEventListener('mousemove', drag);
image.addEventListener('wheel', zoom);
document.getElementById('map-pic').setAttribute('draggable', false);

function startDrag(e) {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    image.style.cursor = 'grabbing';
}

function endDrag() {
    isDragging = false;
    image.style.cursor = 'grab';
}

function drag(e) {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateImageTransform();
}

function zoom(e) {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    console.log(scale)
    scale = Math.min(Math.max(0.1, scale), 3); // limit scale
    updateImageTransform();
}

function updateImageTransform() {
    image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}