// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from "electron";

const bridge = {
  setItem: (key: string, value: string) => {
    ipcRenderer.send("setItem", key, value);
  },
  getItem: (key: string) => ipcRenderer.invoke("getItem", key),
};

contextBridge.exposeInMainWorld("bridge", bridge);

declare global {
  interface Window {
    bridge: typeof bridge;
  }
}
