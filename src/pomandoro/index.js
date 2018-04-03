import './pomandoro.scss'
import template from './template.hbs'
import defaultState from './state.json'
// import { bindEvent } from './infra'

// eslint-disable-next-line
const $ = document.querySelector.bind(document)
// eslint-disable-next-line
const log = console.log.bind(document)

export default class PoMandoro {

  constructor(selector) {
    this.selector = selector
    this.$poman = $(selector)
  }

  init() {
    this.reset()
  }

  state(data = {}) {
    return this._state = Object.assign(this._state | {}, data)
  }

  bind() {
    $(`${this.selector} .start`).addEventListener('click', () => this.start())
    $(`${this.selector} .reset`).addEventListener('click', () => this.reset())
  }

  reset() {
    clearInterval(this.cronometer)
    const state = this.state(defaultState)
    this.render(state)
  }

  pause() {
    clearInterval(this.cronometer)
    this.render(this.state())
  }

  start() {
    let state = this._state

    this.cronometer = setInterval(() => {
      if (state.timer < 1) return this.reset()

      this.render(
        this.state({
          timer: state.timer = state.timer - (500 / 1000),
          progressbar: ((state.timer * 100) / state.fullTime)
        })
      )

    }, 500)
  }

  render() {
    let arr = []

    for (let k in this._state)
      arr[k] = this._state[k]

    this.$poman.innerHTML = template(arr)
    this.bind()
  }

}