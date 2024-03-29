// TODO:
// - Typescript this?
// - Tile design as of now, will be fixing dynamic tiles later on
const TILE = {
  1: [1, 1],
  2: [1, 0], // Floor top
  a: [2, 1], // Wall left
  b: [0, 1], // Wall right
  c: [3, 1], // Corner bottom-left
  d: [4, 1], // Corner bottom-right
  e: [3, 0], // Corner top-left
  f: [4, 0], // Corner top-right
  8: [1, 2], // Floor bottom
  g: [0, 0], // Swing top-left
  h: [2, 0], // Swing top-right
  i: [0, 2], // Swing bottom-left
  j: [2, 2], // swing bottom-right
  x: [3, 2], // PC1
  y: [4, 2], // PC2
  z: [5, 2], // PC3
  X: [3, 3], // PC4
  Y: [4, 3], // PC5
  Z: [5, 3], // PC6
  m: [0, 3], // Platform left
  n: [1, 3], // Platform middle
  o: [2, 3], // Platform right
};
export const STATE = {
  idle: 0,
  walking: 1,
  jumping: 2,
};
export default class Game {
  constructor() {
    // Canvas
    this.canvas = undefined;
    this.ctx = undefined;
    this.width = 900;
    this.height = 600;
    // Player
    this.player = new Player(100, 600, 40, 90, "red");
    // Tiles & entities/collisionobjects
    this.tiles = [];
    this.entities = [];
    // Game configs
    this.scroll = { x: 0, y: 0 };
    this.scrollTransition = { x: 200, y: 0 };
    this.gametime = 0;
    this.last_gametime = new Date().getTime();
  }
  loadCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
    this.width = canvas.getBoundingClientRect().width;
    this.height = canvas.getBoundingClientRect().height;
  }
  loadMap(map) {
    this.map = map.split("\n");
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tile = this.map[y][x];
        const TILE_SIZE = 50;
        const t = new Tile(x, y, TILE_SIZE, TILE_SIZE, "green");
        t.setTile(TILE[tile]);
        // Draw tiles
        if (tile === "1") {
          // Ground
          t.setColor("darkgray");
          this.tiles.push(t);
        } else if (tile === "2") {
          // Floor/Wall
          t.setColor("gray");
          this.tiles.push(t);
        } else if (tile === "3") {
          // Hidden Floor
          t.setColor("black");
          this.tiles.push(t);
        } else if (tile === "4") {
          // Hollow Floor/Wall
          t.setColor("gray");
          this.tiles.push(t);
        } else if (tile === "9") {
          // PC
          t.setColor("blue");
          this.tiles.push(t);
        } else if (tile !== "0") {
          this.tiles.push(t);
        }
        // Collision objects/entities
        const nonCollisionTiles = ["9", "4", "0", "x", "y", "z", "X", "Y", "Z"];
        if (!nonCollisionTiles.includes(tile)) {
          this.entities.push(t);
        }
      }
    }
  }
  init(canvas, map) {
    this.loadCanvas(canvas);
    this.loadMap(map);
  }
  draw() {
    // Independent framerate
    // Get frames per second and divide by 60 (desired frame)
    this.gametime =
      1 / ((new Date().getTime() - this.last_gametime) / 1000) / 60;
    this.last_gametime = new Date().getTime();
    // Clear screen
    this.ctx.clearRect(0, 0, this.width, this.height);
    // Entities & tiles loop
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      this.tiles[i].draw(this.ctx, this.scroll);
    }
    // Scrolling
    if (this.player.facing === 1 && this.scrollTransition.x > 200) {
      this.scrollTransition.x -= 3;
    } else if (this.player.facing === -1 && this.scrollTransition.x < 650) {
      this.scrollTransition.x += 3;
    }
    this.scroll.x += parseInt(
      ((this.player.x - this.scroll.x - this.scrollTransition.x) / 20) *
        this.gametime
    );
    this.scroll.y += parseInt(
      ((this.player.y - this.scroll.y - 300) / 20) * this.gametime
    );
    // Limit scroll view to the map on x coordinate, snaps to place
    if (this.player.x <= 700 && this.scroll.x < 0) this.scroll.x = 0;
    else if (this.player.x >= 3000 && this.scroll.x > 3400)
      this.scroll.x = 3400;
    // Limit scroll view to the map on y coordinate, snaps to place at bottom
    // NOPE: if (this.player.y >= 1400 && this.scroll.y > 1100) this.scroll.y = 1100;
    // Player loop
    this.movePlayer();
    this.player.draw(this.ctx, this.scroll);
    requestAnimationFrame(() => this.draw());
  }
  movePlayer() {
    // Movements
    this.player.force.dx = 0;
    this.player.force.dy = 0;
    // Jump
    if (this.player.movement.up && this.player.jump_cooldown === 0)
      this.player.gravity = -7;
    if (this.player.movement.right || this.player.movement.left)
      this.player.state = STATE.walking;
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
    const collisions = this.move(
      this.player,
      this.player.force,
      this.entities,
      this.gametime
    );
    if (collisions.top)
      // touch above
      this.player.gravity = 0;
    if (collisions.bottom) {
      // touch ground
      this.player.gravity = 0;
      this.player.jump_cooldown = 0;
    } else {
      this.player.jump_cooldown--;
    }
  }
  check_collision(obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }
  test_collisions(entity, entities) {
    const hit_list = [];
    for (let i = 0; i < entities.length; i++) {
      const tile = entities[i];
      if (this.check_collision(entity, tile)) {
        hit_list.push(tile);
      }
    }
    return hit_list;
  }
  move(entity, movement, entities, gametime) {
    const collision = { top: false, left: false, bottom: false, right: false };
    entity.x += movement.dx * gametime;
    let hit_list = this.test_collisions(entity, entities);
    for (const tile of hit_list) {
      if (movement.dx > 0) {
        entity.x = tile.x - entity.width;
        collision.right = true;
      } else if (movement.dx < 0) {
        entity.x = tile.x + tile.width;
        collision.left = true;
      }
    }
    entity.y += movement.dy * gametime;
    hit_list = this.test_collisions(entity, entities);
    for (const tile of hit_list) {
      if (movement.dy > 0) {
        entity.y = tile.y - entity.height;
        collision.bottom = true;
      } else if (movement.dy < 0) {
        entity.y = tile.y + tile.height;
        collision.top = true;
      }
    }
    return collision;
  }
}
class Tile {
  static sprite;
  constructor(x, y, width, height, color) {
    this.width = width;
    this.height = height;
    this.x = x * this.width;
    this.y = y * this.height;
    this.color = color; // change to sprite later on
    // sprite
    this.loadSprite();
    this.sx = 0;
    this.sy = 0;
  }
  loadSprite() {
    // Check for existing sprite
    if (!Tile.sprite) {
      Tile.sprite = new Image();
      Tile.sprite.onload = () => {
        // loaded image
        console.log(Tile.sprite.src);
      };
      Tile.sprite.src = "/tiles.png";
    }
  }
  draw(ctx, scroll) {
    if (this.tileType !== undefined) {
      this.sx = this.tileType[0] * 16 + this.tileType[0] * 1;
      this.sy = this.tileType[1] * 16 + this.tileType[1] * 1;
    }
    if (Tile.sprite.complete) {
      ctx.beginPath();
      ctx.drawImage(
        Tile.sprite,
        this.sx,
        this.sy,
        16, // sprite width
        16, // sprite height
        this.x - scroll.x,
        this.y - scroll.y,
        this.width,
        this.height
      );
      ctx.closePath();
    }

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.rect(this.x - scroll.x, this.y - scroll.y, this.width, this.height);
    // ctx.stroke();
  }
  setColor(color) {
    this.color = color;
  }
  setTile(tile) {
    if (tile !== undefined) {
      this.tileType = tile;
    }
  }
}
class Player extends Tile {
  static sprite;
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);
    this.x = x;
    this.y = y;
    this.facing = 1;
    // Jump & gravity
    this.gravity = 0;
    this.jump_cooldown = 0;
    // Movements
    this.force = { dx: 0, dy: 0 };
    this.movement = { up: false, right: false, down: false, left: false };
    // load sprite
    this.loadSprite();
    this.animateFrame = 0;
    this.maxFrame = 8;
    this.frameTime = 0;
    this.frameTimeCooldown = 14;
    this.state = 0;
    this.animationState = 32 * 2;
  }
  loadSprite() {
    // Check for existing sprite
    if (!Player.sprite) {
      Player.sprite = new Image();
      Player.sprite.onload = () => {
        // loaded image
        console.log(Player.sprite.src);
      };
      Player.sprite.src = "/frame.png";
    }
  }
  draw(ctx, scroll) {
    ctx.beginPath();
    ctx.strokeStyle = "red" || this.color;
    ctx.rect(this.x - scroll.x, this.y - scroll.y, this.width, this.height);
    ctx.stroke();
    this.animate(ctx, scroll);
  }
  playAnimation() {
    if (this.frameTime >= this.frameTimeCooldown) {
      this.animateFrame = (this.animateFrame + this.facing) % this.maxFrame;
      if (this.animateFrame < 0) this.animateFrame = this.maxFrame - 1;
      this.frameTime = 0;
    }
  }
  animate(ctx, scroll) {
    if (this.frameTime < this.frameTimeCooldown) {
      this.frameTime++;
    }
    if (this.state === STATE.idle) {
      this.animationState = this.facing === 1 ? 32 * 0 : 32 * 1;
      this.maxFrame = 4;
      this.frameTimeCooldown = 20;
    } else if (this.state === STATE.walking) {
      this.animationState = this.facing === 1 ? 32 * 2 : 32 * 3;
      this.maxFrame = 8;
      this.frameTimeCooldown = 14;
    }
    this.animateFrame %= this.maxFrame;
    if (Player.sprite.complete) {
      ctx.beginPath();
      ctx.drawImage(
        Player.sprite,
        2 + (14 * this.animateFrame + 2 * this.animateFrame),
        this.animationState,
        14, // sprite width
        32, // sprite height
        this.x - scroll.x,
        this.y - scroll.y - 11,
        this.width,
        this.height + 20
      );
      ctx.closePath();
    }
    this.playAnimation();
  }
}
