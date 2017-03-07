import React, { Component } from 'react'
import styles from './index.css'
import Crop from 'src/components/crop'

export default class Wrap extends Component {
  constructor() {
    super()
    this.state = {
      dataURL: ''
    }
  }

  render() {
    const crop = this.state.dataURL ? (
      <Crop
        width="800"
        ref="imgCrop"
        src={this.state.dataURL}/>
    ) : (
      <div
        onClick={this.selectImg.bind(this)}
        className={styles['crop-placeholder']}>点击选择图片</div>
    )

    return (
      <div>
        <div className={styles.topBar + ' ' + styles.vertical}>
          <label style={{display: 'inline-block'}}>
            <a className={styles.btn}>选择图片</a>
            <input
              ref="file"
              type="file"
              accept="image/*"
              style={{display: 'none'}}
              onChange={this.getImg.bind(this)}/>
          </label>
          <a className={styles.btn} onClick={this.save.bind(this)}>确定</a>
          <a className={styles.btn} download="a.jpg" onClick={this.open.bind(this)}>另存为</a>
        </div>
        <div className={styles.content}>
          { crop }
        </div>
      </div>
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

  save() {
    const dataURL = this.refs.imgCrop.getDataUrl()
    this.setState({
      dataURL: dataURL
    })
  }

  download() {
    const dataUrl = this.refs.imgCrop.getDataUrl()
    const a = document.createElement('a')
    // window.open(dataUrl)
    a.href = dataUrl
    a.download = 'a.png'
    a.innerHTML = 'dsadsa'
    // document.body.appendChild(a)
    a.click()
  }

  open() {
    const dataUrl = this.refs.imgCrop.getDataUrl()
    window.open(dataUrl)
  }
}