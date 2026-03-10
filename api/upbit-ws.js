export function connectWebSocket(codes, onMessage){
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');
    ws.binaryType = 'arraybuffer';

    ws.onopen = () =>{
        console.log('✅ WebSocket 연결됨');
        document.getElementById('ws-status').textContent = 'WebSocket: ✅ 연결됨';
        ws.send(JSON.stringify([
            {ticket:crypto.randomUUID()},
            {type:'ticker', codes}
        ]))
    }

    ws.onmessage = (evt) => {
        const decoder = new TextDecoder('utf-8');
        const data = JSON.parse(decoder.decode(evt.data));
        console.log('📡 수신:', data.code, data.trade_price);
        onMessage(data);
    };

    ws.onerror = (err) => {
        console.error('❌ WebSocket 에러:', err);
        document.getElementById('ws-status').textContent = 'WebSocket: ❌ 에러';
    };

    ws.onclose = () => {
        console.log('🔌 WebSocket 종료');
        document.getElementById('ws-status').textContent = 'WebSocket: 🔌 종료';
    };

    return ws;
}