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

window.onload = function() {
	console.log("Hi");
	cameraStart(video);
	var ctx = canvas.getContext("2d");
	resize_canvas(canvas, video);

	var colors = new tracking.ColorTracker(["yellow"]);
	colors.minDimension = 10;
	colors.on("track", function(event) {
		resize_canvas(canvas, video);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		if (event.data.length === 0) {

		} else {
			event.data.forEach(function(rect) {
				ctx.strokeStyle = "yellow";
				ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
			});
		}
	});

	tracking.track(video, colors);


}