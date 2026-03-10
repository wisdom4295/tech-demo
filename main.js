const { app, BrowserWindow, session } = require('electron'); // ✅ session 추가
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false // ✅ 외부 CDN 허용
        }
    });

    win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
    // ✅ CSP 헤더 제거
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['']
            }
        });
    });

    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
