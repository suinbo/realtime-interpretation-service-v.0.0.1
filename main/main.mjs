import { app, BrowserWindow } from "electron"
import path from "path"
import serve from "electron-serve"

import { fileURLToPath } from "url"
import { dirname } from "path"

// Electron Security Warning 방지
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const appServe = app.isPackaged
    ? serve({
          directory: path.join(__dirname, "../out"),
      })
    : null

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
        },
    })

    if (app.isPackaged) {
        appServe(win).then(() => {
            win.loadURL("app://-")
        })
    } else {
        win.loadURL("http://localhost:3000")
        win.webContents.openDevTools()
        // 패키징되지 않은 동안 Next.JS 프로젝트의 기본 URL(http://localhost:3000)을 통해 앱을 실행
        // Next.JS 콘텐츠 표시 성공할 때까지 앱 콘텐츠를 자동으로 다시 로드
        win.webContents.on("did-fail-load", (e, code, desc) => {
            win.webContents.reloadIgnoringCache()
        })
    }
}

app.on("ready", () => {
    createWindow()
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})
