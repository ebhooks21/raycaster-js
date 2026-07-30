const canvas = document.getElementById("game");
const cContext = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

//Map represented by a 2d array
export const map = [
	[1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,1,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,1,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1]
];

//Player position can be floating point values
export const player = {
	x: 3.5,
	y: 3.5,
	angle: 0,
	moveSpeed: 3,
	rotSpeed: 2
};

//60 degree field-of-view
const FOV = Math.PI / 3;

function render() {
	let rayAngle = 0;
	let rayDirX = 0;
	let rayDirY = 0;
	let mapX = 0;
	let mapY = 0;
	let deltaDistX = 0;
	let deltaDistY = 0;
	let stepX = 0;
	let stepY = 0;
	let sideDistX = 0;
	let sideDistY = 0;
	let hit = false;
	let side = 0;
	let distance = 0;
	let wallHeight = 0;
	let start = 0;

	//Draw floor and ceiling
	cContext.fillStyle = "#009";
	cContext.fillRect(0, 0, canvas.width, (canvas.height / 2));

	cContext.fillStyle = "#222";
	cContext.fillRect(0, (canvas.height / 2), canvas.width, (canvas.height / 2));

	for(let col = 0; col < canvas.width; col++) {
		rayAngle = player.angle - (FOV / 2) + (col / canvas.width) * FOV;

		rayDirX = Math.cos(rayAngle);
		rayDirY = Math.sin(rayAngle);

		mapX = Math.floor(player.x);
		mapY = Math.floor(player.y);

		deltaDistX = Math.abs(1 / rayDirX);
		deltaDistY = Math.abs(1 / rayDirY);

		if(rayDirX < 0) {
			stepX = -1;
			sideDistX = ((player.x + mapX) * deltaDistX);
		}

		else {
			stepX = 1;
			sideDistX = ((mapX + 1 - player.x) * deltaDistX);
		}

		if(rayDirY < 0) {
			stepY = -1;
			sideDistY = ((player.y - mapY) * deltaDistY);
		}
		
		else {
			stepY = 1;
			sideDistY = ((mapY + 1 - player.y) * deltaDistY);
		}

		while(!hit) {
			if(sideDistX < sideDistY) {
				sideDistX += deltaDistX;
				mapX += stepX;
				side = 0;
			}

			else {
				sideDistY += deltaDistY;
				mapY += stepY;
				side = 1;
			}

			if(map[mapY][mapX] > 0) {
				hit = true;
			}
		}

		if(side == 0) {
			distance = (mapX - player.x + (1 - stepX) / 2) / rayDirX;
		}

		else {
			distance = (mapY - player.y + (1 - stepY) / 2) / rayDirY;
		}

		distance *= Math.cos(rayAngle - player.angle);

		wallHeight = (canvas.height / distance);

		start = (canvas.height / 2) - (wallHeight / 2);	

		//Draw the walls

		cContext.fillStyle = "gray";

		cContext.fillRect(col, start, 1, wallHeight);
	}
}

function update(dt) {
	if(keys["ArrowLeft"]) {
		player.angle -= (player.rotSpeed * dt);
	}

	if(keys["ArrowRight"]) {
		player.angle += (player.rotSpeed * dt);
	}

	if(keys["ArrowUp"]) {
		player.x += Math.cos(player.angle) * player.moveSpeed * dt;

		player.y += Math.sin(player.angle) * player.moveSpeed * dt;
	}
}

let previous = performance.now();
const keys = {};

window.addEventListener("keydown", e => {
	keys[e.key] = true;
});

window.addEventListener("keyup", e => {
	keys[e.key] = false;
});

function gameLoop(now) {
	const dt = (now - previous) / 1000;
	previous = now;

	update(dt);
	render();

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);