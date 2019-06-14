console.log('preload')
const {ipcRenderer} = require('electron')

process.once('document-start', () => {
  console.log('document start')
  console.log(document.querySelectorAll('a'))
})

process.once('loaded', () => {
  console.log('loaded')
})

document.addEventListener('DOMContentLoaded', () => {
  console.log('loaded', document.querySelectorAll('a'))
  addCheckbox()
})

const onCheckboxClick = (function() {
  let lastSelectedIndex = -1
  return (event) => {
    const a = event.currentTarget
    const index = a.getAttribute('data-sqdindex')
    const id = a.value
    const checked = a.checked
    console.log(event, index, id, checked)
    if (event.shiftKey) {
      // select multiple songs
      let start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)
      while (start <= end) {
        $(`#sqd_${start}`).prop('checked', checked)
        ++start
      }
    }
    lastSelectedIndex = index
    getSongs()
  }
})()

// add checkbox
function addCheckbox() {
  let index = 0 // 给歌标号，方便多选
  ;[...document.querySelectorAll('a')].forEach((a) => {
    const [_, id] =
      a.href.match(/^https:\/\/www\.sq688\.com\/download\/(\d+)\.html/i) || []
    console.log(a.href, id)
    if (id) {
      const checkbox = document.createElement('input')
      checkbox.setAttribute('type', 'checkbox')
      checkbox.setAttribute('id', `sqd_${++index}`)
      checkbox.setAttribute('data-sqdindex', index)
      checkbox.value = id
      a.insertBefore(checkbox, a.firstChild)
      $(checkbox).click(onCheckboxClick)
    }
  })
}

function getSongs() {
  const songs = []
  ;[...document.querySelectorAll('input[data-sqdindex]')].forEach(
    (checkbox) => {
      if (checkbox.checked) {
        const name = $(checkbox)
          .parent('a')
          .text()
        const id = checkbox.value
        songs.push({id, name})
      }
    }
  )
  ipcRenderer.sendToHost('songlist', songs)
}
