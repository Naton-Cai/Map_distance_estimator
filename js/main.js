const mapimage = document.getElementById('image-container');
const container = document.getElementById('map-container');
const allwaypoints = document.getElementsByClassName('waypoint')

let rectimage = mapimage .getBoundingClientRect()
let isDragging = false;
let startX = 0, startY = 0  ;
let translateX = 0, translateY = 0;
let scale = 1;
let profilePic = document.getElementById("map-pic");
let inputFile = document.getElementById("input-file");
let wayPointIndex = 0;

mapimage.addEventListener('mousedown',  mouseDownControl);
document.addEventListener('mouseup', mouseUpControl);
mapimage.addEventListener('mousemove', drag);
mapimage.addEventListener('wheel', zoom);
mapimage.addEventListener('contextmenu', spawnWaypoint);
document.addEventListener('keyup', statuscheck);
document.getElementById('map-pic').setAttribute('draggable', false);

inputFile.onchange = function(){
    profilePic.src = URL.createObjectURL(inputFile.files[0])
    rectimage = mapimage.getBoundingClientRect()
}

function mouseDownControl(e){
    switch (e.button) {
        case 0:
            startDrag(e)   
            //console.log("Left button clicked.");
            break;
        case 1:
            //console.log("Middle button clicked.");
            break;
        case 2:
            //console.log("Right button clicked.");
            break;
        default:
            console.log(`Unknown button code: ${e.button}`);
      }    
}

function mouseUpControl(e){
    switch (e.button) {
        case 0:
            endDrag(e)  
            //console.log("Left button clicked.");
            break;
        case 1:
            //console.log("Middle button clicked.");
            break;
        case 2:
            //console.log("Right button clicked.");
            break;
        default:
            console.log(`Unknown button code: ${e.button}`);
      }    
}

function statuscheck() {
    console.log(translateX, translateY)
    //console.log((e.clientX) + 'px', (e.clientY) + 'px')
}

function startDrag(e) {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    mapimage.style.cursor = 'grabbing';
    mapimage.style.cursor = 'grabbing';
 
}

function endDrag() {
    isDragging = false;
    mapimage.style.cursor = 'grab';
}

function drag(e) {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateImageTransform(e);
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

    updateImageTransform(e);

}   

function spawnWaypoint(e){
    e.preventDefault();
    console.log("spawn")
    var rect = mapimage.getBoundingClientRect();
    console.log(e.clientX, e.clientY)
    var x = e.clientX-rect.left;  //x position within the image element
    var y = e.clientY-rect.top;  //y position within the image element

    var img = document.createElement("img");
    img.src = "images/waypoint75.png";
    img.id = "waypoint" + 1;


    img.classList.add("waypoint"); 
    img.style.position = 'absolute'; // Set position to absolute to position the waypoint correctly
    img.style.transformOrigin = 'center center'; // Set the transform origin to center

    img.style.left = x+'px'; // Set left position relative to the container
    img.style.top = y+'px'; // Set top position relative to the container
    img.style.scale = 0.03
    img.style.pointerEvents = 'none'; // Make the waypoint image non-interactable to prevent interference with dragging

    mapimage.appendChild(img);
    
    wayPointIndex++; // Increment the waypoint index;
}

function updateImageTransform(e) {
    translateX = Math.min(Math.max(-rectimage.width*0.5*scale, translateX), rectimage.width*0.5*scale);   //ensures that the map image does not go pass the border 
    translateY = Math.min(Math.max(-rectimage.height*0.5*scale, translateY), rectimage.height*0.5*scale);
    mapimage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}