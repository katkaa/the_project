var constrains = {
	video: {
		facingMode: "enviorenment"
	}
}

const video = document.querySelector("#video"),
      canvas = document.querySelector("#canvas"),
      cameraSensor = document.querySelector("#camera-sensor"),
      cameraTrigger = document.querySelector("#camera-trigger")

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

function resize_canvas(canvas, video, normvars) {
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
 
 	console.log("resizing");
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;

    n = get_normvars([video.videoWidth, video.videoHeight], [displayWidth, displayHeight]);
    normvars.s = n.s;
    normvars.o = n.o;
  }
}

function get_normvars(videoSize, canvasSize) {
	var canvasR = canvasSize[0] / canvasSize[1];
	var videoR = videoSize[0] / videoSize[1];
	var scaleRatio;
	if (canvasR < videoR) {
		scaleRatio = videoSize[1]/canvasSize[1];
	} else {
		scaleRatio = videoSize[0]/canvasSize[0];
	}
	var offset = [-((videoSize[0]*scaleRatio)-canvasSize[0])/2, 0];
	n = {s: scaleRatio, o: offset};
	return n;
}

function norm_vals(rect,normvars) {
	rect = rect * normvars.s;
	rect = rect + normvars.o;
	return rect;
}

window.onload = function() {
	console.log("Hi");
	cameraStart(video);
	var ctx = canvas.getContext("2d");
	var normvars = get_normvars([video.videoWidth, video.videoHeight], [canvas.displayWidth, canvas.displayHeight]);
	resize_canvas(canvas, video, normvars);

	var colors = new tracking.ColorTracker(["yellow"]);
	colors.on("track", function(event) {
		resize_canvas(canvas, video, normvars);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		if (event.data.length === 0) {

		} else {
			console.log(normvars);
			event.data.forEach(function(rect) {
				rect = norm_vals(rect,normvars);
				ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
			});
		}
	});

	tracking.track(video, colors);


}