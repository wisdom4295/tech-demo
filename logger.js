export function addLog(type, message) {
    const panel = document.getElementById('log-panel');

    if (!panel) {
        console.warn('[addLog] log-panel 없음:', message);
        return;
    }

    const now = new Date();
    const time = now.toLocaleTimeString('ko-KR', { hour12: false });

    const iconMap = {
        success: '✅',
        wallet:  '✅',
        ws:      '📡',
        db:      '💾',
        error:   '❌',
    };

    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = `[${time}] ${iconMap[type] ?? 'ℹ️'} ${message}`;

    panel.appendChild(line);
    panel.scrollTop = panel.scrollHeight;
}
