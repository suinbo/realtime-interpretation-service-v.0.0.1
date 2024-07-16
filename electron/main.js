const { app, BrowserWindow } = require("electron")

let isDev

import("electron-is-dev")
    .then(module => {
        isDev = module.default || module
    })
    .catch(err => {
        console.error("Failed to load electron-is-dev:", err)
    })

const path = require("path")
const url = require("url")

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // Next.js에서 node 모듈을 사용할 수 있게 함
        },
    })

    const startUrl = isDev
        ? "http://localhost:3000" // Next.js 개발 서버 주소
        : url.format({
              pathname: path.join(__dirname, "../out/index.html"), // Next.js 빌드 결과 폴더 경로
              protocol: "file:",
              slashes: true,
          })

    mainWindow.loadURL(startUrl)

    mainWindow.on("closed", () => {
        mainWindow = null
    })
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow()
    }
})
