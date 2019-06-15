function waitForSelector(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject('timeout', timeout)
    })
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
  const inputForPassword = document.querySelector('.pickpw input')
  const buttonForPick = document.querySelector('.pickpw .g-button')
  let buttonForSave = document.querySelector('a[title="保存到网盘"')
  if (inputForPassword && buttonForPick && !buttonForSave) {
    inputForPassword.value = password
    buttonForPick.click()
    buttonForSave = await waitForSelector('a[title="保存到网盘"]')
  }
  if (buttonForSave) {
    console.log('can save now')
  }
}
