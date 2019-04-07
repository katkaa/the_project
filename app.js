var constrains = {
	video: {
		facingMode: "enviorenment"
	}
}

const video = document.querySelector("#video"),
      canvas = document.querySelector("#canvas"),
      cameraSensor = document.querySelector("#camera-sensor"),
      cameraTrigger = document.querySelector("#camera-trigger")

var img0 = new Image();
img0.src = "test.png";

tracking.ColorTracker.registerColor('DOT', function(r, g, b) {
var threshold = 50,
  dx = r - 255,
  dy = g - 255,
  dz = b - 0;

if ((r - b) >= threshold && (g - b) >= threshold) {
  return true;
}
return dx * dx + dy * dy + dz * dz < 10000;
});

function cameraStart(video) {
	navigator.mediaDevices
		.getUserMedia(constrains)
		.then(function(stream) {
			track = stream.getTracks()[0];
			video.srcObject = stream;
		}).catch(function(error) {
        	alert("R U SHURE U GOT CAMERA???");
    	});
}

function grab() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
}

function resize_canvas(canvas, video) {
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
 
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

function normalize_rect(rect, videoSize, canvasSize) {
	vr = videoSize[0]/videoSize[1];
	cr = canvasSize[0]/canvasSize[1];
	// console.log(vr);
	// console.log(cr);
	if (cr > vr) {
		scale = canvasSize[0]/videoSize[0];
		rect.y *= (videoSize[1]*scale/canvasSize[1]);
		rect.height *= (videoSize[1]*scale/canvasSize[1]);;
		offset = (videoSize[1]*scale-canvasSize[1])/2;
		rect.y -= offset;

	} else {
		scale = canvasSize[1]/videoSize[1];
		rect.x *= (videoSize[0]*scale/canvasSize[0]);
		rect.width *= (videoSize[0]*scale/canvasSize[0]);;
		offset = (videoSize[0]*scale-canvasSize[0])/2;
		rect.x -= offset;
	}
	rect.x += rect.width/2;
	rect.y += rect.height/2;
	return rect;
}

function normalize_dots(dots) {
	new_dots = [];
	max_x = 0.1;
	max_y = 0.1;
	min_x = 10000;
	min_y = 10000;
	for (i=0; i<dots.length; i++) {
		max_x = Math.max(max_x, dots[i].x);
		max_y = Math.max(max_y, dots[i].y);
		min_x = Math.min(min_x, dots[i].x);
		min_y = Math.min(min_y, dots[i].y);
	}
	for (i=0; i<dots.length; i++) {
		new_dots.push([(dots[i].x-min_x)/(max_x-min_x), (dots[i].y-min_y)/(max_y-min_y)]);
	}
	return new_dots;
}

function draw_img(ctx, dots, img) {
	new_dots = [];
	max_x = 0.1;
	max_y = 0.1;
	min_x = 10000;
	min_y = 10000;
	for (i=0; i<dots.length; i++) {
		max_x = Math.max(max_x, dots[i].x);
		max_y = Math.max(max_y, dots[i].y);
		min_x = Math.min(min_x, dots[i].x);
		min_y = Math.min(min_y, dots[i].y);
	}
	ctx.drawImage(img0, min_x, min_y, max_x-min_x, max_y-min_y);
}

function match_dots(dots, pattern) {

}

function draw_grid(ctx,dots) {
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillRect(0,0,100,100);
	ctx.strokeRect(0,0,100,100);
	ctx.fillStyle = "red";
	for (i=0;i<dots.length;i++) {
		console.log(dots[i][0],dots[i][1]);
		ctx.fillRect(dots[i][0]*100-3,dots[i][1]*100-3,6,6);
	}
}

window.onload = function() {
	console.log("Hi");
	cameraStart(video);
	var ctx = canvas.getContext("2d");
	resize_canvas(canvas, video);

	var colors = new tracking.ColorTracker(["DOT"]);
	// colors.minDimension = 20;
	// colors.minGroupSize = 50;
	colors.on("track", function(event) {
		resize_canvas(canvas, video);
		ctx.clearRect(0,0,canvas.width,canvas.height);

		if (event.data.length === 0) {

		} else {
			dots = [];
			event.data.forEach(function(rect) {
				rect = normalize_rect(rect, [video.videoWidth, video.videoHeight], [canvas.width, canvas.height])
				ctx.strokeStyle = "yellow";
				ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
				dots.push(rect);
			});
			ndots = normalize_dots(dots);
			draw_grid(ctx,ndots);










			draw_img(ctx,dots,img0);
		}
	});

	tracking.track(video, colors);


}