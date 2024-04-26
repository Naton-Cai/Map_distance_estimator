const image = document.getElementById('map-pic');
const container = document.getElementById('map-container');

let rectimage = image.getBoundingClientRect()
let isDragging = false;
let startX, startY;
let translateX = 0, translateY = 0;
let scale = 1;
let profilePic = document.getElementById("map-pic");
let inputFile = document.getElementById("input-file");

image.addEventListener('mousedown', startDrag);
document.addEventListener('mouseup', endDrag);
image.addEventListener('mousemove', drag);
image.addEventListener('wheel', zoom);
document.addEventListener('keyup', statuscheck);
document.getElementById('map-pic').setAttribute('draggable', false);


inputFile.onchange = function(){
    profilePic.src = URL.createObjectURL(inputFile.files[0])
    rectimage = image.getBoundingClientRect()
}

function statuscheck() {
    console.log(translateX, translateY)
}

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
    var oldscale = scale 
    scale += (e.deltaY * -0.001*scale);
    scale = Math.min(Math.max(0.1, scale), 10); // limit scale

    //console.log(oldscale, scale, rectimage.width, rectimage.height)
    if (scale != oldscale)
    { 
        translateX += e.deltaY * -0.001*translateX; //moves the image so that the focus point of the image is at the same postion after zooming in and out
        translateY += e.deltaY * -0.001*translateY;
    }

    updateImageTransform();

}   

function updateImageTransform() {
    translateX = Math.min(Math.max(-rectimage.width*0.5*scale, translateX), rectimage.width*0.5*scale);   //ensures that the map image does not go pass the border 
    translateY = Math.min(Math.max(-rectimage.height*0.5*scale, translateY), rectimage.height*0.5*scale);
    image.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}