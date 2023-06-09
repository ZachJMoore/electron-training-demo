/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from "fs";
import * as path from "path";
import * as positioner from "electron-traywindow-positioner";
import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// Auto updates
require("update-electron-app")({
  repo: "ZachJMoore/electron-training-demo",
});

let mainWindow: BrowserWindow | null = null;
let mainTray: Tray | null = null;

const createTray = (): void => {
  mainTray = new Tray(path.join(__dirname, "assets", "trayIconTemplate.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit",
      type: "radio",
      role: "quit",
    },
  ]);

  const handleLeftClick = () => {
    if (mainWindow?.isVisible()) {
      mainWindow?.hide();
    } else {
      // move to tray position
      positioner.position(mainWindow, mainTray.getBounds());

      // show window
      mainWindow?.show();
    }
  };

  const handleRightClick = () => mainTray.popUpContextMenu(contextMenu);

  mainTray.setToolTip("Todo");
  mainTray.on("click", handleLeftClick);
  mainTray.on("right-click", handleRightClick);
};

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 450,
    width: 400,
    resizable: false,
    frame: false,
    show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      devTools: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  createWindow();
  createTray();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("setItem", (event, key, value) => {
  console.log("setItem", key);

  fs.writeFileSync(path.join(app.getPath("userData"), key), value);
});

ipcMain.handle("getItem", (event, key) => {
  console.log("getItem", key);

  try {
    return fs.readFileSync(path.join(app.getPath("userData"), key), "utf8");
  } catch (error) {
    return null;
  }
});
