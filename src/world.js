/* define world blocks */
const GOAL = -2
const ENTRANCE = -1
const EMPTY = 0
const BUILDING = 2

class World {
  map = {}
  paths = []
  entrances = []

  constructor(width, height, size) {
    Object.assign(this, {width, height, size})

    /* create map and add tiles */
    for (let x=0; x < width; x++) {
      this.map[x] = {}
      for (let y=0; y < height; y++) {
        this.map[x][y] = EMPTY
      }
    }

    /* define entrance squares (2 on each side) */
    this.entrances = [
      [Math.floor(width/2+.5), 0],
      [Math.floor(width/2-.5), 0],

      [0, Math.floor(height/2+.5)],
      [0, Math.floor(height/2-.5)],

      [Math.floor(width/2+.5), height-1],
      [Math.floor(width/2-.5), height-1],

      [width-1, Math.floor(height/2+.5)],
      [width-1, Math.floor(height/2-.5)],
    ]

    /* define world goals (center 4 squares) */
    this.goals = [
      [Math.floor(width/2-.5), Math.floor(height/2-.5)],
      [Math.floor(width/2-.5), Math.floor(height/2+.5)],
      [Math.floor(width/2+.5), Math.floor(height/2+.5)],
      [Math.floor(width/2+.5), Math.floor(height/2-.5)]
    ]

    /* write entrances to map */
    for (const coord of this.entrances)
      this.map[coord[0]][coord[1]] = ENTRANCE

    /* write goals to map */
    for (const coord of this.goals) {
      this.map[coord[0]][coord[1]] = GOAL
      this.paths.push(new WorldPath(this, coord[0], coord[1]),)
    }
  }
}

class WorldTile {
  draw(canvas, ctx) {
    if (this.mouseover) {
      ctx.fillStyle = "rgba(255,255,255,.2"
      ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size)
    }

    if(this.world.map[this.x][this.y] == EMPTY) {
      ctx.strokeStyle = "rgba(255,255,255,.05)"
      ctx.strokeRect(this.x*this.size, this.y*this.size, this.size, this.size)
    } else if(this.world.map[this.x][this.y] == GOAL) {
      ctx.fillStyle = "rgba(255,255,255,.1)"
      ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size)
    } else if(this.world.map[this.x][this.y] == ENTRANCE) {
      ctx.fillStyle = "rgba(255,255,255,.1)"
      ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size)
    } else if(this.world.map[this.x][this.y] == BUILDING) {
      ctx.fillStyle = "rgba(100,100,100,1)"
      ctx.fillRect(this.x*this.size, this.y*this.size, this.size, this.size)
    }
  }

  click (ev, x, y) {
    /* ignore tile if not under cursor */
    if (x < this.x*this.size + 1 ) return
    if (x > this.x*this.size + this.size - 1) return
    if (y < this.y*this.size + 1 ) return
    if (y > this.y*this.size + this.size - 1) return

    /* try to set new building to world */
    const previous = this.world.map[this.x][this.y]
    if ( this.world.map[this.x][this.y] == BUILDING ) {
      this.world.map[this.x][this.y] = 0
    } else {
      this.world.map[this.x][this.y] = BUILDING
    }

    /* revert building if a path is blocked */
    for(const [name, path] of Object.entries(this.world.paths)) {
      if (!path.reload()) {
        this.world.map[this.x][this.y] = previous
        path.reload()
        return
      }
    }
  }

  hover (ev, x, y) {
    /* update mouseover flag on tile */
    this.mouseover = false
    if (x < this.x*this.size + 1 ) return
    if (x > this.x*this.size + this.size - 1) return
    if (y < this.y*this.size + 1 ) return
    if (y > this.y*this.size + this.size - 1) return
    this.mouseover = true
  }

  constructor(x, y, world, size ) {
    Object.assign(this, {x, y, world, size})
  }
}

class WorldPath {
  movemap = {}
  debug = false

  poke(x, y, score) {
    /* skip invalid pokes */
    if(!this.movemap[x]) return
    if(!this.movemap[x][y]) return
    if(this.movemap[x][y] <= score) return
    if(this.world.map[x][y] > 0) return

    /* write score and proceed */
    this.movemap[x][y] = score
    score++

    /* poke into each direction */
    this.poke(x, y + 1, score) // down
    this.poke(x, y - 1, score) // up
    this.poke(x + 1, y, score) // right
    this.poke(x - 1, y, score) // left
  }

  next(x, y) {
    /* obtain next waypoint for given position */
    const score = this.movemap[x][y]
    let target = {
      field: [x, y],
      score: score
    }

    /* define valid directions */
    const directions = {
      left: [x-1, y], right: [x+1, y],
      top: [x, y-1], bottom: [x, y+1]
    }

    /* check each direction for best score */
    for(const [name, field] of Object.entries(directions)) {
      if (this.movemap[field[0]] && this.movemap[field[0]][field[1]] !== 'undefined') {
        const score = this.movemap[field[0]][field[1]]
        if(score < target.score) {
          target.field = field
          target.score = score
        }
      }
    }

    return target
  }

  reload() {
    /* fill with 4096 as default */
    for(const x in Object.entries(this.world.map)) {
      this.movemap[x] = {}
      for(const y in Object.entries(this.world.map[x])) {
        this.movemap[x][y] = 4096
      }
    }

    /* recursive poke into each direction */
    this.poke(this.x, this.y, 0)

    /* check entrances for blocked paths */
    for(const coord of this.world.entrances)
      if (this.movemap[coord[0]][coord[1]] == 4096)
        return false

    return true
  }

  constructor(world, x, y, debug) {
    Object.assign(this, { world, x, y, debug })
    this.reload()
  }
}
