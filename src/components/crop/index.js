import React, { Component, PropTypes } from 'react'
import styles from './index.css'

export default class Crop extends Component {
  constructor() {
    super()

    this.mouseEvent = null
    this.minSize = 100
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
    const drawCfg = state.drawCfg
    let gridLines = [[0, '33.3333%', '100%', 1], [0, '66.6666%', '100%', 1], ['33.3333%', 0, 1, '100%'], ['66.6666%', 0, 1, '100%']]

    return (
      <div className={styles.wrap} ref="wrap"
        style={{
          width: state.width + 'px',
          height: state.height + 'px',
          margin: '0 auto'
        }}>
        <img
          ref="img"
          src={this.props.src}
          className={styles['img-bg']}
          style={{display: this.props.src ? 'block' : 'none'}}
          onLoad={this.getDrawCfg.bind(this)}/>
        <div
          className={styles['img-grid']}
          onMouseDown={(e) => this.mouseDown(e, this.move)}
          style={{
            display: this.props.src ? 'block' : 'none',
            left: drawCfg.sx + 'px',
            top: drawCfg.sy + 'px',
            width: drawCfg.width+'px',
            height: drawCfg.height+'px',
            backgroundImage: 'url(' + this.props.src + ')',
            backgroundPosition: -drawCfg.sx + 'px ' + -drawCfg.sy + 'px',
            backgroundSize: state.width + 'px'}}>
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
            style={{top: 0, left: 0, cursor: 'nw-resize'}}
            onMouseDown={(e) => this.mouseDown(e, this.topLMove)}>
          </div>
          <div
            className={styles['img-grid-btn']}
            style={{top: 0, right: 0, cursor: 'ne-resize'}}
            onMouseDown={(e) => this.mouseDown(e, this.topRMove)}>
          </div>
          <div
            className={styles['img-grid-btn']}
            style={{bottom: 0, right: 0, cursor: 'se-resize'}}
            onMouseDown={(e) => this.mouseDown(e, this.bottomRMove)}>
          </div>
          <div
            className={styles['img-grid-btn']}
            style={{bottom: 0, left: 0, cursor: 'sw-resize'}}
            onMouseDown={(e) => this.mouseDown(e, this.bottomLMove)}>
          </div>
          <div
            className={styles['img-grid-btn-center']}
            style={{top: 0, left: '50%', transform: 'translate(-50%, 0)', cursor: 'n-resize'}}
            onMouseDown={(e) => this.mouseDown(e, this.topMove)}>
          </div>
          <div
            className={styles['img-grid-btn-center']}
            style={{top: '50%', right: 0, transform: 'translate(0, -50%)', cursor: 'e-resize'}}
            onMouseDown={(e) => this.mouseDown(e, this.rightMove)}>
          </div>
          <div
            className={styles['img-grid-btn-center']}
            style={{bottom: 0, left: '50%', transform: 'translate(-50%, 0)', cursor: 's-resize'}}
            onMouseDown={(e) => this.mouseDown(e, this.bottomMove)}>
          </div>
          <div
            className={styles['img-grid-btn-center']}
            style={{top: '50%', left: 0, transform: 'translate(0, -50%)', cursor: 'w-resize'}}
            onMouseDown={(e) => this.mouseDown(e, this.leftMove)}>
          </div>
        </div>
        <canvas
          className={styles['img-canvas']}
          ref="canvas"
          style={{
            display: 'none'}}>
        </canvas>
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
    const drawCfg = this.state.drawCfg
    const img = this.state.img
    const offsetWidth = img.offsetWidth
    const offsetHeight = img.offsetHeight
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight
    this.setState({
      width: offsetWidth,
      height: offsetHeight,
      drawCfg: Object.assign(drawCfg, {
        ratio: offsetWidth / naturalWidth,
        width: offsetWidth,
        height: offsetHeight,
        dWidth: naturalWidth,
        dHeight: naturalHeight,
        sWidth: naturalWidth,
        sHeight: naturalHeight,
        sx: 0,
        sy: 0
      })
    })
  }

  drawImg() {
    const state = this.state
    const canvas = state.canvas
    const drawCfg = state.drawCfg

    canvas.width = drawCfg.width / drawCfg.ratio
    canvas.height = drawCfg.height / drawCfg.ratio
    state.ctx.drawImage(state.img, drawCfg.sx / drawCfg.ratio, drawCfg.sy / drawCfg.ratio, drawCfg.sWidth, drawCfg.sHeight, drawCfg.dx, drawCfg.dy, drawCfg.dWidth, drawCfg.dHeight)
  }

  mouseDown(e, callback) {
    e.stopPropagation()
    e.preventDefault()

    this.mouse.x = e.screenX
    this.mouse.y = e.screenY

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

    const x = e.screenX - this.mouse.x
    const y = e.screenY - this.mouse.y

    this.mouse.x = e.screenX
    this.mouse.y = e.screenY

    this.mouseEvent({x, y})
  }

  setPos(pos, x, y) {
    const state = this.state
    const drawCfg = state.drawCfg
    let sx = pos.sx === undefined ? drawCfg.sx : pos.sx
    let sy = pos.sy === undefined ? drawCfg.sy : pos.sy
    let width = pos.width === undefined ? drawCfg.width : pos.width
    let height = pos.height === undefined ? drawCfg.height : pos.height
    const maxSy = state.height - height
    const maxSx = state.width - width
    const maxWidth = state.width - sx
    const maxHeight = state.height - sy

    this.setState({
      drawCfg: Object.assign(drawCfg, {sy, sx, width, height})
    })
  }

  move(pos) {
    const drawCfg = this.state.drawCfg
    let sy = drawCfg.sy + pos.y
    let sx = drawCfg.sx + pos.x
    const maxSy = this.state.height - drawCfg.height
    const maxSx = this.state.width - drawCfg.width

    if (sx < 0) sx = drawCfg.sx
    if (sy < 0) sy = drawCfg.sy
    if (sx > maxSx) sx = maxSx
    if (sy > maxSy) sy = maxSy

    this.setPos({
      sx,
      sy
    })
  }

  // topLMove(pos) {
  //   this.topMove(pos)
  //   this.leftMove(pos)
  // }
  topLMove(pos) {
    const drawCfg = this.state.drawCfg
    let sy = drawCfg.sy + pos.y
    let sx = drawCfg.sx + pos.x
    let width = drawCfg.width - pos.x
    let height = drawCfg.height - pos.y

    if (sx < 0) {
      sx = drawCfg.sx
      width = drawCfg.width
    }
    if (sy < 0) {
      sy = drawCfg.sy
      height = drawCfg.height
    }
    if (width < this.minSize) {
      sx = drawCfg.sx
      width = drawCfg.width
    }
    if (height < this.minSize) {
      sy = drawCfg.sy
      height = drawCfg.height
    }

    this.setPos({
      sy : sy,
      sx : sx,
      width: width,
      height: height
    })
  }

  topRMove(pos) {
    const drawCfg = this.state.drawCfg
    let sy = drawCfg.sy + pos.y
    let width = drawCfg.width + pos.x
    let height = drawCfg.height - pos.y
    const maxWidth = this.state.width - drawCfg.sx

    if (sy < 0) {
      sy = drawCfg.sy
      height = drawCfg.height
    }
    if (width > maxWidth) width = maxWidth
    if (width < this.minSize) {
      width = this.minSize
    }
    if (height < this.minSize) {
      sy = drawCfg.sy
      height = this.minSize
    }

    this.setPos({
      sy: sy,
      width: width,
      height: height
    })
  }

  bottomLMove(pos) {
    const drawCfg = this.state.drawCfg
    let sx = drawCfg.sx + pos.x
    let height = drawCfg.height + pos.y
    let width = drawCfg.width - pos.x
    const maxHeight = this.state.height - drawCfg.sy

    if (sx < 0) {
      sx = drawCfg.sx
      width = drawCfg.width
    }
    if (height > maxHeight) height = maxHeight
    if (width < this.minSize) {
      sx = drawCfg.sx
      width = drawCfg.width
    }
    if (height < this.minSize) {
      height = this.minSize
    }

    this.setPos({
      sx: sx,
      height: height,
      width: width,
    })
  }

  bottomRMove(pos) {
    const drawCfg = this.state.drawCfg
    let width = drawCfg.width + pos.x
    let height = drawCfg.height + pos.y
    const maxWidth = this.state.width - drawCfg.sx
    const maxHeight = this.state.height - drawCfg.sy

    if (width > maxWidth) width = maxWidth
    if (height > maxHeight) height = maxHeight
    if (width < this.minSize) {
      width = this.minSize
    }
    if (height < this.minSize) {
      height = this.minSize
    }

    this.setPos({
      height,
      width,
    })
  }

  topMove(pos) {
    const drawCfg = this.state.drawCfg
    let sy = drawCfg.sy + pos.y
    let height = drawCfg.height - pos.y

    if (sy < 0) {
      sy = drawCfg.sy
      height = drawCfg.height
    }
    if (height < this.minSize) {
      sy = drawCfg.sy
      height = drawCfg.height
    }

    this.setPos({
      sy: sy,
      height: height
    })
  }

  rightMove(pos) {
    const drawCfg = this.state.drawCfg
    let width = drawCfg.width + pos.x
    const maxWidth = this.state.width - drawCfg.sx

    if (width > maxWidth) width = maxWidth
    if (width < this.minSize) {
      width = this.minSize
    }

    this.setPos({
      width: width
    })
  }

  bottomMove(pos) {
    const drawCfg = this.state.drawCfg
    let height = drawCfg.height + pos.y
    const maxHeight = this.state.height - drawCfg.sy

    if (height > maxHeight) height = maxHeight
    if (height < this.minSize) {
      height = this.minSize
    }

    this.setPos({
      height,
    })
  }

  leftMove(pos) {
    const drawCfg = this.state.drawCfg
    let sx = drawCfg.sx + pos.x
    let width = drawCfg.width - pos.x

    if (sx < 0) {
      sx = drawCfg.sx
      width = drawCfg.width
    }
    if (width < this.minSize) {
      sx = drawCfg.sx
      width = drawCfg.width
    }

    this.setPos({
      sx: sx,
      width: width,
    })
  }

  getDataUrl() {
    this.drawImg()
    return this.state.canvas.toDataURL()
  }

}

Crop.propTypes = {
  src: PropTypes.string.isRequired
}