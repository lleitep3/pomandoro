// eslint-disable-next-line
const $ = document.querySelector.bind(document)

export const bindEvent = (event, ...args) => {
  const $target = args.shift()
  let childTarget

  if (args.length > 1) childTarget = args.shift()

  const callback = args.shift()

  $target.addEventListener(event, (e) => {

    if (!childTarget) callback(e)

    if (e.target && e.target.classList.contains(childTarget)) callback(e)
  })
}

export default {
  bindEvent: bindEvent
}