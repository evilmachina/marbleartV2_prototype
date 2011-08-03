function circle() {
  this.x = 0;
  this.y = 0;
  this.r = 5; 
  this.fill = "blue";
}

var canvas;
var ctx;
var canvasWidth;
var canvasHeight;
var INTERVAL = 20;  
var isDrag = false;
var mx, my; 
var canvasValid = false;
var mySel; 

var mySelColor = '#CC0000';
var mySelWidth = 2;

// we use a fake canvas to draw individual shapes for selection testing
var ghostcanvas;
var gctx; // fake canvas context

// since we can drag from anywhere in a node
// instead of just its x/y corner, we need to save
// the offset of the mouse when we start dragging.
var offsetx, offsety;

// Padding and border style widths for mouse offsets
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

var knob, track;
var background;
var canvasWidth =0; 
var canvasHeight = 0;


function resize(){
	
	var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
	
	var C = 1;        
	var W_TO_H = 1;//2/1;  
	if(viewportWidth < viewportHeight){
		canvasWidth = viewportWidth * C;
		canvasHeight = canvasWidth / W_TO_H;
    }
	else{
			canvasHeight = viewportHeight * C;
			canvasWidth = canvasHeight / W_TO_H;
	}

    canvas.style.position = "fixed";
    canvas.setAttribute("width", canvasWidth);
    canvas.setAttribute("height", canvasHeight);
    canvas.style.top = (viewportHeight - canvasHeight) / 2;
    canvas.style.left = (viewportWidth - canvasWidth) / 2;
   	canvasHeight = canvas.height;
	canvasWidth = canvas.width;
    invalidate();
}

function init() {
  canvas = document.getElementById('canvas');
  resize();
  canvasHeight = canvas.height;
  canvasWidth = canvas.width;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = canvasHeight;
  ghostcanvas.width = canvasWidth;
  gctx = ghostcanvas.getContext('2d');
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.onselectstart = function () { return false; }
   window.onresize = resize; 
  // fixes mouse co-ordinate problems when there's a border or padding
  // see getMouse for more detail
  if (document.defaultView && document.defaultView.getComputedStyle) {
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  setInterval(draw, INTERVAL);

  // set our events. Up and down are for dragging,
  // double click is for making new boxes
   canvas.onmousedown = myDown;
   canvas.onmouseup = myUp;
 // canvas.ondblclick = myDblClick;

  // add custom initialization here:

  // add an orange rectangle
  knob = new circle;
  knob.x = 20;
  knob.y = 20;
  knob.r = 10;
}

function clear(canvas) {
  canvas.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawTrack(context){
	var y = canvas.height/2,
		x = canvas.width/2,
		r = (canvas.width > canvas.height) ? (canvas.height*0.4) : (canvas.width*0.4) ;
    context.strokeStyle = "gray";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, true);
    context.stroke();	
}

function draw() {
  if (canvasValid == false) {
    clear(ctx);
    var context = ctx;
    drawTrack(context);

    context.fillStyle = knob.fill;
    context.beginPath();
    context.arc(knob.x, knob.y, knob.r, 0, Math.PI*2, true);
    context.fill();
    

/*    if (mySel != null) {
      ctx.strokeStyle = mySelColor;
      ctx.lineWidth = mySelWidth;
	  ctx.beginPath();
	  ctx.arc(mySel.x,mySel.y,mySel.r, 0, Math.PI*2, false);
      ctx.stroke();
    }*/

    canvasValid = true;
  }
}

function invalidate() {
  canvasValid = false;
}

function myDown(e){
  getMouse(e);
  clear(gctx);
  
  // drawshape(gctx, knob, 'black');
    
    // get image data at the mouse x,y pixel
    var imageData = ctx.getImageData(mx, my, 1, 1);
    var index = (mx + my * imageData.width) * 4;
    console.log("hej");
    // if the mouse pixel exists, select and break
    if (imageData.data[3] > 0) {
      mySel = knob;
      offsetx = mx - mySel.x;
      offsety = my - mySel.y;
      mySel.x = mx - offsetx;
      mySel.y = my - offsety;
      isDrag = true;
      canvas.onmousemove = myMove;
      invalidate();
      clear(gctx);
      
      return;
    }
    
  // havent returned means we have selected nothing
  mySel = null;
  // clear the ghost canvas for next time
  clear(gctx);
  // invalidate because we might need the selection border to disappear
  invalidate();
}

function myUp(){
  isDrag = false;
  canvas.onmousemove = null;
  invalidate();
 mySel = null;
 //clear(gctx);

}

function getMouse(e) {
      var element = canvas, offsetX = 0, offsetY = 0;

      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      offsetX += stylePaddingLeft;
      offsetY += stylePaddingTop;

      offsetX += styleBorderLeft;
      offsetY += styleBorderTop;

      mx = e.pageX - offsetX;
      my = e.pageY - offsetY
}
