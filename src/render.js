class Render {
  /* holds all objects to be rendered */
  registry = []

  update () {
    /* run update functions of each object */
    for (const obj of this.registry) {
      if(obj.update) obj.update(this.canvas, this.ctx)
    }
  }

  draw () {
    /* clear screen and run draw function of each object */
    this.ctx.globalCompositeOperation = "destination-over";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const obj of this.registry) {
      if(obj.draw) obj.draw(this.canvas, this.ctx)
    }
  }

  show(object) {
    /* add object to render registry */
    this.registry.push(object)
  }

  hide(object) {
    /* remove object from render registry */
    this.registry = this.registry.filter(item => item !== object)
  }

  mouse (ev) {
    /* get current mouse position */
    const rect = this.canvas.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top

    if (ev.type == "click") {
      /* run click functions of all objects */
      for (const obj of this.registry) {
        if (obj.click) obj.click(ev, x, y)
      }
    } else if (ev.type === "mousemove" || ev.type === "mouseleave") {
      /* run hover function of all objects */
      for (const obj of this.registry) {
        if (obj.hover) obj.hover(ev, x, y)
      }
    }
  }

  constructor(canvas, fps = 120) {
    /* obtain canvas ctx and save fps */
    this.ctx = canvas.getContext("2d")
    this.canvas = canvas
    this.fps = fps

    /* attach mouse handler */
    canvas.addEventListener("click", (ev) => { this.mouse(ev) })
    canvas.addEventListener("mousemove", (ev) => { this.mouse(ev) })
    canvas.addEventListener("mouseleave", (ev) => { this.mouse(ev) })

    /* attach update and draw handlers */
    setInterval(() => { this.update() }, 1000/60)
    setInterval(() => { this.draw() }, 1000/fps)
  }
}
