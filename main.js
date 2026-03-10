const {app, BrowserWindow} = require('electron');
const path = require('path');

function createWindow(){
    const win = new BrowserWindow({
        width:1024,
        height:768,
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
        }
    })
    // 개발: Vite 로컬 서버
    win.loadURL('http://localhost:5173');

    // 배포: 빌드된 파일
    // win.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () =>{
    if(process.platform !== 'darwin') app.quit();
})