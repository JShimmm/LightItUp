var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext('2d'), 
		W = window.innerWidth,
		H = window.innerHeight, 
		limit = 0, // limit the number of fireworks on screen
		mx, // mouse x
		my; // mouse y
		
// set canvas dimensions 
canvas.width = W;
canvas.height = H;

ctx.font = "20px Georgia";
ctx.fillStyle = "white";
ctx.fillText("Click anywhere to create fireworks",10,50);
ctx.fillStyle = "black";

// create fireworks
var fireworks = [];

// set an opacity
ctx.globalAlpha = 0.3;

// whenever mouse is moved, we update the x and y coordinates
canvas.addEventListener('mousemove', function( e ) { 
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});

// draw a firework when mouse is clicked
canvas.addEventListener('click', function( e ) {
	if (limit <= 1){
		this.x = mx; 
		this.y = my;
		this.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')'; // random color generator
		fireworks.push(new firework(this.x, this.y, this.color)); // add a new firework
		drawFireworks(fireworks.length-1, this.color); // draw the firework
		limit++; 
	}
});

// single firework (just a line)
function firework(x, y, color){
	this.x = x; 
	this.y = y;
	this.offset = 0;
	this.particles = [];
	for(var i = 0; i < 15; i++) { this.particles.push(new particle(this.x, this.y, color)); } // each firework also has particles
}

// draws the fireworks
function drawFireworks(index, color){
	var f = fireworks[index]; // get a single firework based on index given

	// draws a line based on the offset
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = 5;
	ctx.moveTo(f.x, H - f.offset);
	ctx.lineTo(f.x, H - f.offset - 20);
	ctx.stroke();

	f.offset += 15;

	// if the line has not reached our cursor, we recursively call drawFireworks, increasing our offset each time
	if (H - f.offset > f.y){
		requestAnimationFrame(function () {
		ctx.fillRect(0, 0, W, H);
        drawFireworks(index, color);
    });
	}
	else
	{
		// when the line has reached our cursor, we draw the particles
		drawParticle(f.particles);
	}
}

// single particle
function particle(x, y, color){
	this.x = x;
	this.y = y;

	// each particle moves in a random angle 
	this.vx = Math.random()*20 - 10;
	this.vy = Math.random()*20 - 10;

	this.outbounds = false; // used to check if the particle has gone offscreen 

	this.color = color;
}

function drawParticle(particles){
	for (var i = 0; i < particles.length; i++)
	{
		var p = particles[i];

		ctx.beginPath();

		// creates a trailing effect on our particle
		var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 5);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.5, "white");
		gradient.addColorStop(0.5, p.color);
		gradient.addColorStop(1, "black");

		// draws our particle 
		ctx.fillStyle = gradient;
		ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
		ctx.fill();

		// increase our velocity
		p.x += (p.vx * 2);
		p.y += (p.vy * 2);	

		// checks if the particle has gone offscreen 
		if (p.x > W || p.x < 0 || p.y > H || p.y < 0) {p.outbounds = true;}
	}

	this.count = 0;
	for (var i = 0; i < particles.length; i++){
		var p = particles[i];
		if (p.outbounds){ count++; }
	}

	// if all particles are offscreen, remove them, and decrease our limit 
	if (count == 15){
		ctx.clearRect(0, 0, W, H);
		limit--;
		return;
	}

	// recursively call drawParticle 
	requestAnimationFrame(function () {
	ctx.clearRect(0, 0, W, H);
    drawParticle(particles); 
	});
}
