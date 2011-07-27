function circle() {
  this.x = 0;
  this.y = 0;
  this.r = 5; 
  this.fill = "blue";
}

var canvas;
var ctx;
var WIDTH;
var HEIGHT;
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

function init() {
  canvas = document.getElementById('canvas');
  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  ctx = canvas.getContext('2d');
  ghostcanvas = document.createElement('canvas');
  ghostcanvas.height = HEIGHT;
  ghostcanvas.width = WIDTH;
  gctx = ghostcanvas.getContext('2d');
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.onselectstart = function () { return false; }
  
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
 // canvas.onmousedown = myDown;
 // canvas.onmouseup = myUp;
 // canvas.ondblclick = myDblClick;

  // add custom initialization here:

  // add an orange rectangle
  knob = new circle;
  knob.x = 20;
  knob.y = 20;
  knob.r = 10;

  track = new circle;
  track.x = WIDTH/2;
  track.y = HEIGHT/2;
  track.r = WIDTH*0.8/2;

}

function clear(canvas) {
  canvas.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw() {
  if (canvasValid == false) {
    clear(ctx);
    var context = ctx;
    context.strokeStyle = "gray";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(track.x,track.y, track.r, 0, Math.PI*2, true);
    context.stroke();



    context.fillStyle = knob.fill;
    context.beginPath();
    context.arc(knob.x,knob.y, knob.r, 0, Math.PI*2, true);
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