export function connectWebSocket(codes, onMessage, onStatusChange) {
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
        console.log('✅ WebSocket 연결됨');
        onStatusChange?.('connected'); // ← DOM 대신 콜백
        ws.send(JSON.stringify([
            { ticket: crypto.randomUUID() },
            { type: 'ticker', codes }
        ]));
    };

    ws.onmessage = (evt) => {
        const decoder = new TextDecoder('utf-8');
        const data = JSON.parse(decoder.decode(evt.data));
        console.log('📡 수신:', data.code, data.trade_price);
        onMessage(data);
    };

    ws.onerror = (err) => {
        console.error('❌ WebSocket 에러:', err);
        onStatusChange?.('error');
    };

    ws.onclose = () => {
        console.log('🔌 WebSocket 종료');
        onStatusChange?.('closed');
    };

    return ws;
}
