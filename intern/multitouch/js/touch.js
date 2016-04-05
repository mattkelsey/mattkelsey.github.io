var canvas, ctx;
var w = 0;
var h = 0;

var timer;
var updateStarted = false;
var touches = [];


function update() {
	  if (updateStarted) return;
	  updateStarted = true;

	  var nw = window.innerWidth;
	  var nh = window.innerHeight;

	  if ((w != nw) || (h != nh)) {
		    w = nw;
		    h = nh;
		    canvas.style.width = w+'px';
		    canvas.style.height = h+'px';
		    canvas.width = w;
		    canvas.height = h;
	  }

	  ctx.clearRect(0, 0, w, h);

    var i, len = touches.length;
	  for (i=0; i<len; i++) {
		var touch = touches[i];
        var px = touch.pageX;
        var py = touch.pageY;

        //Main Particle
		    ctx.beginPath();
		    ctx.arc(px, py, 40, 0, 2*Math.PI, true);
		    ctx.fillStyle = "rgba(0, 0, 250, 0.2)";
		    ctx.fill();
		    ctx.lineWidth = 2.0;
		    ctx.strokeStyle = "rgba(0, 0, 250, 0.8)";
		    ctx.stroke();
    }

	  updateStarted = false;
}

function ol() {
	  canvas = document.getElementById('canvas');
	  ctx = canvas.getContext('2d');
	  timer = setInterval(update, 15);
	  particles = [],
    rockets = [],
    MAX_PARTICLES = 400,
    colorCode = 0;

    canvas.addEventListener('touchend', function() {
	      ctx.clearRect(0, 0, w, h);
    });

    canvas.addEventListener('touchmove', function(event) {
        event.preventDefault();
        touches = event.touches;
    });

    canvas.addEventListener('touchstart', function(event) {
        console.log('start');
    });
};

