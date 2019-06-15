const {ipcRenderer} = require('electron')
document.addEventListener('DOMContentLoaded', (e) => {
  const domain = e.srcElement.domain
  console.log(e)
  if (domain === 'www.sq688.com') {
    const urlhtml = document.querySelector('.downurl').innerHTML
    const [_, url, password] = urlhtml.match(
      /链接:\s*([^\s]+)\s+[^\s]+:\s*([\w]+)/
    )
    ipcRenderer.sendToHost('pan_info', {
      url,
      password
    })
  }
})
