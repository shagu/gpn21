class Mob {
  update (canvas, ctx) {
    /* move unit to next waypoint */
    if(this.x < this.nx) {
      if(this.x + this.speed >= this.nx) {
        this.x = this.nx
      } else {
        this.x += this.speed
      }
    } else if (this.x > this.nx) {
      if(this.x - this.speed <= this.nx) {
        this.x = this.nx
      } else {
        this.x -= this.speed
      }
    } else if(this.y < this.ny) {
      if(this.y + this.speed >= this.ny) {
        this.y = this.ny
      } else {
        this.y += this.speed
      }
    } else if (this.y > this.ny) {
      if(this.y - this.speed <= this.ny) {
        this.y = this.ny
      } else {
        this.y -= this.speed
      }
    }

    /* obtain next point if next is reached */
    if(this.x == this.x && this.y == this.ny) {
      const next = this.world.paths[this.goal].next(this.nx, this.ny)
      this.nx = next.field[0]
      this.ny = next.field[1]
    }

    /* goal waypoint is reached */
    if(this.nx == this.x && this.ny == this.y) {
      this.life = 0
      return
    }
  }

  draw (canvas, ctx) {
    /* draw mob on screen */
    const tile = this.world.size
    const size = tile/3
    const padding = tile - size*2

    ctx.fillStyle = `rgba(${this.r},${this.g},${this.b},1)`
    ctx.fillRect(this.x*tile+padding, this.y*tile+padding, size, size)
  }

  constructor( world, entrance = 0, goal = 0, speed = 0.1, r = 255, g = 255, b = 255) {
    Object.assign(this, { world, entrance, goal, speed, r, g, b })

    /* set position to entrance */
    this.x = world.entrances[entrance][0]
    this.y = world.entrances[entrance][1]

    /* write next waypoint */
    this.nx = this.x
    this.ny = this.y

    /* start with 100 life */
    this.life = 100
  }
}
