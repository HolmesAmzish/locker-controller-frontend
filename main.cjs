const { app, BrowserWindow } = require("electron");
const isDev=require('electron-is-dev');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        title: "智能快递柜控制面板",
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableBlinkFeatures: true,
            contextIsolation: false,
        },
    });

    const url=isDev? "http://localhost:5173": "http://localhost:5173";
    mainWindow.loadURL(url);

    isDev&& mainWindow.webContents.openDevTools();
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });
    mainWindow.webContents.on("dom-ready", () => {});

    mainWindow.webContents.on("did-finish-load", () => {});

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};

app.on("ready", () => {
    createWindow();
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});
