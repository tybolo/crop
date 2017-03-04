import React, { Component, PropTypes } from 'react'
import styles from './index.css'

export default class Crop extends Component {
  constructor() {
    super()

    this.mouseEvent = null
    this.mouse = {
      x: 0,
      y: 0
    }

    this.state = {
      img: null,
      canvas: null,
      ctx: null,
      drawCfg: {
        width: 300,
        height: 300,
        sx: 0,
        sy: 0,
        sWidth: 0,
        sHeight: 0,
        dx: 0,
        dy: 0,
        dWidth: 0,
        dHeight: 0
      }
    }
  }

  render() {
    const state = this.state
    let gridLines = [[0, '33.3333%', '100%', 1], [0, '66.6666%', '100%', 1], ['33.3333%', 0, 1, '100%'], ['66.6666%', 0, 1, '100%']]

    return (
      <div className={styles.wrap} ref="wrap">
        <img
          ref="img"
          src={this.props.src}
          className={styles['img-bg']}
          style={{display: this.props.src ? 'block' : 'none'}}
          onLoad={this.getDrawCfg.bind(this)}/>
        <canvas
          className={styles['img-canvas']}
          ref="canvas"
          width={state.drawCfg.width}
          height={state.drawCfg.height}
          style={{
            left: state.drawCfg.sx + 'px',
            top: state.drawCfg.sy + 'px'}}>
        </canvas>
        <div
          className={styles['img-grid']}
          onMouseDown={(e) => this.mouseDown(e, this.move)}
          style={{
            display: this.props.src ? 'block' : 'none',
            left: state.drawCfg.sx + 'px',
            top: state.drawCfg.sy + 'px',
            width: state.drawCfg.width+'px',
            height: state.drawCfg.height+'px'}}>
          {
            gridLines.map((line, index) => {
              return (
                <div key={index} className={styles['img-grid-line']} style={{
                  left: line[0],
                  top: line[1],
                  width: line[2],
                  height: line[3]
                }}></div>
              )
            })
          }
          <div
            className={styles['img-grid-btn']}
            style={{top: 0, left: 0}}
            onMouseDown={(e) => this.mouseDown(e, this.topLMove)}>
          </div>
          <div
            className={styles['img-grid-btn']}
            style={{top: 0, right: 0}}
            onMouseDown={(e) => this.mouseDown(e, this.topRMove)}>
          </div>
          <div
            className={styles['img-grid-btn']}
            style={{bottom: 0, right: 0}}
            onMouseDown={(e) => this.mouseDown(e, this.bottomRMove)}>
          </div>
          <div
            className={styles['img-grid-btn']}
            style={{bottom: 0, left: 0}}
            onMouseDown={(e) => this.mouseDown(e, this.bottomLMove)}>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.setState({
      canvas: this.refs.canvas,
      ctx: this.refs.canvas.getContext('2d'),
      img: this.refs.img
    })
  }

  getDrawCfg() {
    const img = this.state.img
    this.setState({
      drawCfg: Object.assign(this.state.drawCfg, {
        ratio: img.offsetWidth / img.naturalWidth,
        width: img.offsetWidth,
        height: img.offsetHeight,
        dWidth: img.offsetWidth,
        dHeight: img.offsetHeight,
        sWidth: img.naturalWidth,
        sHeight: img.naturalHeight,
        sx: 0,
        sy: 0
      })
    }, () => {
      this.drawImg()
    })
  }

  drawImg() {
    const state = this.state
    state.ctx.drawImage(state.img, state.drawCfg.sx / this.state.drawCfg.ratio, state.drawCfg.sy / this.state.drawCfg.ratio, state.drawCfg.sWidth, state.drawCfg.sHeight, state.drawCfg.dx, state.drawCfg.dy, state.drawCfg.dWidth, state.drawCfg.dHeight)
  }

  mouseDown(e, callback) {
    e.stopPropagation()
    e.preventDefault()

    this.mouse.x = e.pageX
    this.mouse.y = e.pageY

    this.mouseEvent = callback
    document.body.addEventListener('mousemove', (e) => {
      this.mouseMove(e)
    })
    document.body.onmouseup = () => {
      this.mouseEvent = null
    }
  }

  mouseMove(e) {
    if (!this.mouseEvent) return
    e.preventDefault()

    const x = e.pageX - this.mouse.x
    const y = e.pageY - this.mouse.y

    this.mouse.x = e.pageX
    this.mouse.y = e.pageY

    this.mouseEvent({x, y})
  }

  move(pos) {
    const drawCfg = this.state.drawCfg
    let sy = drawCfg.sy + pos.y
    let sx = drawCfg.sx + pos.x

    this.setPos({
      sx,
      sy
    })
  }

  topLMove(pos) {
    const drawCfg = this.state.drawCfg
    let sy = drawCfg.sy + pos.y
    let sx = drawCfg.sx + pos.x
    // console.log('sx', sx, pos.x)
    // console.log('wi', drawCfg.width - pos.x, pos.x)
    console.log('sx', sx - drawCfg.sx)
    console.log('wi', drawCfg.width - (drawCfg.width - pos.x))

    this.setPos({
      sy,
      sx,
      width: sx <= 0 ? drawCfg.width : drawCfg.width - pos.x,
      height: sy <= 0 ? drawCfg.height : drawCfg.height - pos.y
    })
  }

  topRMove(pos) {
    const drawCfg = this.state.drawCfg
    let sy = drawCfg.sy + pos.y
    let width = drawCfg.width + pos.x
    console.log('tr')

    this.setPos({
      sy,
      width,
      height: sy <= 0 ? drawCfg.height : drawCfg.height - pos.y
    })
  }

  bottomLMove(pos) {
    const drawCfg = this.state.drawCfg
    let sx = drawCfg.sx + pos.x
    let height = drawCfg.height + pos.y
    console.log('bl')

    this.setPos({
      sx,
      height,
      width: sx <= 0 ? drawCfg.width : drawCfg.width - pos.x,
    })
  }

  bottomRMove(pos) {
    const drawCfg = this.state.drawCfg
    let width = drawCfg.width + pos.x
    let height = drawCfg.height + pos.y
    console.log('br')

    this.setPos({
      height,
      width,
    })
  }

  setPos(pos) {
    const drawCfg = this.state.drawCfg
    let sx = pos.sx || drawCfg.sx
    let sy = pos.sy || drawCfg.sy
    let width = pos.width || drawCfg.width
    let height = pos.height || drawCfg.height
    const maxSy = drawCfg.dHeight - height
    const maxSx = drawCfg.dWidth - width

    if (sy < 0) sy = 0
    if (sx < 0) sx = 0
    if (sy >= maxSy) sy = maxSy
    if (sx >= maxSx) sx = maxSx
    if ((sx + width) > drawCfg.dWidth) width = drawCfg.dWidth - sx
    if ((sy + height) > drawCfg.dHeight) height = drawCfg.height
    if (width < 100) width = 100
    if (height < 100) height = 100

    this.setState({
      drawCfg: Object.assign(drawCfg, {sy, sx, width, height})
    }, () => {
      this.drawImg()
    })
  }

  getDataUrl() {
    return this.state.canvas.toDataURL()
  }

}

Crop.propTypes = {
  src: PropTypes.string.isRequired
}