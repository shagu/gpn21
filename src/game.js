const canvas = document.getElementById("canvas")
const hud = document.getElementById("hud")
const hud_units = document.getElementById("hud_units")
const hud_max = document.getElementById("hud_max")

let mobs = []
let tiles = []
let mobs_max = 0

/* create render process and world */
const render = new Render(canvas, 120)
const world = new World(16, 16, 48)

for (let x=0; x < world.width; x++) {
  for (let y=0; y < world.height; y++) {
    const tile = new WorldTile(x, y, world, world.size)
    render.show(tile)
    tiles.push(tile)
  }
}

/* main loop */
setInterval(() => {
  /* update environment */
  for (const mob of mobs)
    if (mob.life <= 0)
      render.hide(mob)

  mobs = mobs.filter(mob => mob.life !== 0)
  mobs_max = Math.max(mobs.length, mobs_max)

  /* spawn new mobs */
  const start = Math.floor(Math.random()*8)
  const end = Math.floor(Math.random()*4)
  const speed = Math.random()/100+0.01
  const red = Math.random()*200+55
  const green = Math.random()*200+55
  const blue =Math.random()*200+55
  const mob = new Mob(world, start, end, speed, red, blue, green)
  render.show(mob)
  mobs.push(mob)

  /* update hud elements */
  hud_units.innerHTML = `${mobs.length}`
  hud_max.innerHTML = `${mobs_max}`

  const diff = mobs_max - mobs.length
  hud_units.style.color = `rgb(255, ${Math.max(255-diff*10, 100)}, ${Math.max(255-diff*10, 100)})`
}, 100)
