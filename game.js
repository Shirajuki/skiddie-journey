class Game {
	constructor() {
		// Canvas
		this.canvas;
		this.ctx;
		this.width = 900;
		this.height = 600;
		// Player
		this.player = new Player(100,100,50,80,"red");
		// Tiles & entities/collisionobjects
		this.tiles = [];
		this.entities = [];
		// Game configs
		this.scroll = {x: 0, y: 0};
		this.gametime = 0;
		this.last_gametime = new Date().getTime();
	}
	loadCanvas(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");
		this.width = canvas.getBoundingClientRect().width;
		this.height = canvas.getBoundingClientRect().height;
	}
	loadMap(map) {
		this.map = map.split("\n");
		for (let y = 0; y < this.map.length; y++) {
			for (let x = 0; x < this.map[y].length; x++) {
				const tile = +this.map[y][x];
				const TILE_SIZE = 50;
				const t = new Tile(x,y,TILE_SIZE, TILE_SIZE,"green");
				// Draw tiles
				if (tile === 2) {
					t.setColor("gray");
					this.tiles.push(t);
				} else if (tile === 1) {
					t.setColor("darkgray");
					this.tiles.push(t);
				} else if (tile === 9) {
					t.setColor("blue");
					this.tiles.push(t);
				}
				// Collision objects/entities
				if (tile !== 0 && tile !== 9) {
					this.entities.push(t);
				}
			}
		}
	}
	init(canvas,map) {
		this.loadCanvas(canvas);
		this.loadMap(map);
	}
	draw() {
		// Independent framerate
		// Get frames per second and divide by 60 (desired frame)
		this.gametime = 1/((new Date().getTime() - this.last_gametime)/1000)/60;
		this.last_gametime = new Date().getTime();
		// Clear screen
		this.ctx.clearRect(0,0,this.width,this.height);
		// Entities & tiles loop
		for (let i = this.tiles.length-1; i >= 0; i--) {
			this.tiles[i].draw(this.ctx,this.scroll);
		}
		// Scrolling
		this.scroll.x += parseInt((this.player.x-this.scroll.x-200)/20 * this.gametime);
		this.scroll.y += parseInt((this.player.y-this.scroll.y-260)/20 * this.gametime);
		// Player loop
		this.movePlayer();
		this.player.draw(this.ctx,this.scroll);
		requestAnimationFrame(() => this.draw());
	}
	movePlayer() {
		// Movements
		this.player.force.dx = 0;
		this.player.force.dy = 0;
		// Jump
		if (this.player.movement.up && this.player.jump_cooldown == 0) this.player.gravity = -7;
		// Horizontal movement
		if (this.player.movement.left) {
			this.player.force.dx -= 4;
			this.player.facing = -1;
		}
		if (this.player.movement.right) {
			this.player.force.dx += 4;
			this.player.facing = 1;
		}
		// Gravity
		this.player.force.dy += this.player.gravity;
		this.player.gravity += 0.2;
		if (this.player.gravity > 9) this.player.gravity = 9;
		// Collisions
		const collisions = this.move(this.player, this.player.force, this.entities, this.gametime);
		if (collisions.top) // touch above
			this.player.gravity = 0;
		if (collisions.bottom) { // touch ground
			this.player.gravity = 0;
			this.player.jump_cooldown = 0;
		} else {
			this.player.jump_cooldown--;
		}
	}
	check_collision(obj1, obj2) {
		return (obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x && 
			obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y);
	}
	test_collisions(entity, entities) {
		const hit_list = [];
		for (let i = 0; i < entities.length; i++) {
			const tile = entities[i];
			if (this.check_collision(entity,tile)) {
				hit_list.push(tile);
			}
		}
		return hit_list;
	}
	move(entity, movement, entities, gametime) {
		const collision = {top: false, left: false, bottom: false, right: false};
		entity.x += movement.dx * gametime;
		let hit_list = this.test_collisions(entity, entities);
		for (const tile of hit_list) {
			if (movement.dx > 0) {
				entity.x = tile.x - entity.width;
				collision.right = true;
			}
			else if (movement.dx < 0) {
				entity.x = tile.x + tile.width;
				collision.left = true;
			}
		}
		entity.y += movement.dy * gametime;
		hit_list = this.test_collisions(entity,entities);
		for (const tile of hit_list) {
			if (movement.dy > 0) {
				entity.y = tile.y - entity.height;
				collision.bottom = true;
			}
			else if (movement.dy < 0) {
				entity.y = tile.y + tile.height;
				collision.top = true;
			}
		}
		return collision;
	}
}
class Tile {
	constructor(x,y,width,height,color) {
		this.width = width;
		this.height = height;
		this.x = x*this.width;
		this.y = y*this.height;
		this.color = color; // change to sprite later on
	}
	draw(ctx,scroll) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x-scroll.x, this.y-scroll.y, this.width, this.height);
		ctx.fill();
	}
	setColor(color) {
		this.color = color;
	}
}
class Player extends Tile {
	constructor(x,y,width,height,color) {
		super(x,y,width,height,color)
		this.x = x;
		this.y = y;
		this.facing = 1;
		// Jump & gravity
		this.gravity = 0;
		this.jump_cooldown = 0;
		// Movements
		this.force = {dx: 0, dy: 0}
		this.movement = {up: false, right: false, down: false, left: false};
	}
}
const game = new Game();
window.addEventListener("load",function() {
	const canvas = document.getElementById("canvas");
	game.init(canvas,map);
	game.draw();
	setTimeout(() => console.log(game),500);
	document.addEventListener('keydown', keyDownHandler, false);
	document.addEventListener('keyup', keyUpHandler, false);
});
function keyDownHandler(event) {
	switch(event.keyCode) {
		case 37:
			game.player.movement.left = true;
			break;
		case 38:
			game.player.movement.up = true;
			break;
		case 39:
			game.player.movement.right = true;
			break;
		case 40:
			game.player.movement.down = true;
			break;

	} 
}
function keyUpHandler(event) {
	switch(event.keyCode) {
		case 37:
			game.player.movement.left = false;
			break;
		case 38:
			game.player.movement.up = false;
			break;
		case 39:
			game.player.movement.right = false;
			break;
		case 40:
			game.player.movement.down = false;
			break;
	} 
}
