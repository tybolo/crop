import React, { Component } from 'react'
import styles from './index.css'
import Crop from 'src/components/crop'

export default class Wrap extends Component {
  constructor() {
    super()
    this.state = {
      isCrop: true,
      dataURL: '',
      history: [],
    }
  }

  render() {
    const crop = this.state.dataURL ? (
      <Crop
        width="800"
        ref="imgCrop"
        src={this.state.dataURL}
        isCrop={this.state.isCrop}/>
    ) : (
      <div
        onClick={this.selectImg.bind(this)}
        className={styles['crop-placeholder']}>点击选择图片</div>
    )

    return (
      <div>
        <div className={styles.topBar + ' ' + styles.vertical}>
          <a className={styles['topBar-btn']} onClick={this.selectImg.bind(this)}>选择图片</a>
          { this.createBtn(this.state.dataURL && this.state.isCrop, this.save, '确定') }
          { this.createBtn(!this.state.isCrop, this.download, '另存为') }
          { this.createBtn(!this.state.isCrop, this.crop, '继续裁剪') }
          { this.createBtn(this.state.history.length, this.revoke, '撤销') }
          { this.createBtn(this.state.dataURL && this.state.isCrop, this.open, '预览')}
        </div>
        <div className={styles.content}>
          { crop }
        </div>
        <input
          ref="file"
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          onChange={this.getImg.bind(this)}/>
      </div>
    )
  }

  createBtn(conditional, handle, value) {
    return conditional ? (
      <a className={styles['topBar-btn']} onClick={handle.bind(this)}>{ value }</a>
    ) : (
      <a className={[styles['topBar-btn'], styles.disabled].join(' ')}>{ value }</a>
    )
  }

  selectImg() {
    this.refs.file.click()
  }

  getImg(e) {
    const input = e.target
    this.getDataURL(input.files[0])
    input.value = ''
  }

  getDataURL(file) {
    const reader = new FileReader()
    reader.onload = () => {
      this.setState({
        dataURL: reader.result
      })
    }
    reader.readAsDataURL(file)
  }

  crop() {
    this.setState({
      isCrop: true
    })
  }

  save() {
    const history = this.state.dataURL
    const dataURL = this.refs.imgCrop.getDataUrl()
    this.setState({
      isCrop: false,
      dataURL: dataURL,
      history: this.state.history.concat([history])
    })
  }

  download() {
    const dataURL = this.state.dataURL
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = dataURL
    a.download = 'image.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  revoke() {
    const data = this.state.history[this.state.history.length - 1]
    this.setState({
      isCrop: true,
      dataURL: data,
      history: this.state.history.filter((item, index) => index < this.state.history.length - 1)
    })
  }

  open() {
    const dataUrl = this.refs.imgCrop.getDataUrl()
    window.open(dataUrl)
  }
}