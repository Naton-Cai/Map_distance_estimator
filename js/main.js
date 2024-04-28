const mapimage = document.getElementById('image-container');
const container = document.getElementById('map-container');
const allwaypoints = document.getElementsByClassName('waypoint')

let rectimage = mapimage.getBoundingClientRect()
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
mapimage.addEventListener('contextmenu', spawnWaypointMouse);
document.addEventListener('keyup', statuscheck);
document.getElementById('map-pic').setAttribute('draggable', false);

inputFile.onchange = function(){
    profilePic.src = URL.createObjectURL(inputFile.files[0])
    rectimage = mapimage.getBoundingClientRect()
}

function test(e){
    console.log("yo")
}

function mouseDownControl(e){
    switch (e.button) {
        case 0:
            if (e.target == mapimage){
                startDrag(e) 
            }

            if (e.target.classList == "waypoint"){
                return
            }

            console.log(e.target.classList)
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

function statuscheck(e) {
    e.preventDefault();
    if (e.code === 'Space') {
        return;
    }
}

function generate_path(){
    var c=document.getElementById("myCanvas");//document.createElement("canvas");
    c.style.width ='100%';
    c.style.height='100%';
    c.width  = c.offsetWidth;
    c.height = c.offsetHeight;
    c.style.pointerEvents = 'none'; 

    var ctx=c.getContext("2d"); 

    var waypointx = null
    var waypointy = null

    let waypoints = document.querySelectorAll('.waypoint')
    waypoints.forEach(waypoint => {
        var rect = waypoint.getBoundingClientRect();
        var parentRect = mapimage.getBoundingClientRect();
        var waypointParentX = rect.left - parentRect.left;
        var waypointParentY = rect.top - parentRect.top;
        
        if (waypointx != null && waypointy != null) {
            ctx.beginPath();
            ctx.lineWidth = "3";
            ctx.strokeStyle = "red";
            ctx.moveTo(waypointx/scale+9, waypointy/scale+9);
            ctx.lineTo(waypointParentX/scale+9, waypointParentY/scale+9);
            ctx.stroke();
        }
        waypointx = waypointParentX;
        waypointy = waypointParentY;

    });
}

function startDrag(e) {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
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

function spawnWaypointMouse(e){
    e.preventDefault();
    var rect = mapimage.getBoundingClientRect();
    spawnWaypoint((e.clientX - rect.left)/scale - 9,(e.clientY - rect.top)/scale - 9)
    generate_path()
}

function spawnWaypoint(x,y){
    console.log("spawn")

    var img = document.createElement("img");
    img.src = "images/icons/waypointbordered.svg";
    img.id = "waypoint" + wayPointIndex; // Use wayPointIndex to ensure unique IDs for each waypoint

    img.classList.add("waypoint"); 
    img.id = "waypoint"+wayPointIndex
    img.style.position = 'absolute'; 
    img.style.transformOrigin = 'center center'; 
    img.style.width = '18px'; // Set the width of the waypoint image
    img.style.height = '18px'; // Set the height of the waypoint image
    img.style.left = (x) + 'px'; // Adjust the left position to center the image
    img.style.top = (y) + 'px'; // Adjust the top position to center the image


    mapimage.appendChild(img);
    
    wayPointIndex++;  
}



function updateImageTransform(e) {
    console.log(e.target.x, translateX)
    translateX = Math.min(Math.max(-rectimage.width*0.5*scale, translateX), rectimage.width*0.5*scale);   //ensures that the map image does not go pass the border 
    translateY = Math.min(Math.max(-rectimage.height*0.5*scale, translateY), rectimage.height*0.5*scale);
    mapimage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}