const {ipcRenderer} = require('electron')
function waitForSelector(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject('timeout')
    }, timeout)
    const look = () => {
      const element = document.querySelector(selector)
      if (element) {
        clearTimeout(timer)
        resolve(element)
      } else {
        setTimeout(look, 1000)
      }
    }
    look()
  })
}

window.getPassword = async (password, folder) => {
  console.log(`get ${password}`)
  const errorContainer = document.querySelector('.share-error-left')
  if (errorContainer) {
    ipcRenderer.sendToHost('pan_saved', false)
    return
  }
  const inputForPassword = document.querySelector('.pickpw input')
  const buttonForPick = document.querySelector('.pickpw .g-button')
  let buttonForSave = document.querySelector('a[title="保存到网盘"')
  if (inputForPassword && buttonForPick && !buttonForSave) {
    inputForPassword.value = password
    buttonForPick.click()
    buttonForSave = await waitForSelector('a[title="保存到网盘"]')
  }
  buttonForSave.click()
  const buttonForCreate = await waitForSelector('a[title="新建文件夹"]')
  console.log('buttonForCreate', buttonForCreate)
  let panFolder = document.querySelector(`span[node-path="/${folder}"]`)
  if (!panFolder) {
    buttonForCreate.click()
    const newFolderInput = await waitForSelector('.shareFolderInput')
    newFolderInput.value = folder
    document.querySelector('.shareFolderConfirm').click()
    panFolder = await waitForSelector(`span[node-path="/${folder}"]`)
  }
  panFolder.click()
  document.querySelector('.dialog-fileTreeDialog a[title="确定"]').click()
  ipcRenderer.sendToHost('pan_saved', true)
}
