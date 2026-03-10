import { initDB, saveTicker, getTickers } from './db/rxdb-setup.js';
import { connectWallet, disconnectWallet, getWalletAccount } from './wallet/wagmi-setup.js';
import { connectWebSocket } from './api/upbit-ws.js';
import { addLog } from './logger.js';

window.addEventListener('load', async () => {
    await window.Clerk.load();
    const clerk = window.Clerk;

    if (clerk.user) {
        showApp(clerk);
    } else {
        await clerk.mountSignIn(document.getElementById('sign-in'));
        clerk.addListener(({ user }) => {
            if (user) showApp(clerk);
        });
    }
});

async function showApp(clerk) {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    document.getElementById('user-info').textContent =
        `👤 ${clerk.user.primaryEmailAddress?.emailAddress}`;

    document.getElementById('sign-out-btn').onclick = () => {
        clerk.signOut().then(() => location.reload());
    };

    addLog('success', `Clerk 로그인 - ${clerk.user.primaryEmailAddress?.emailAddress}`);

    // ── RxDB 초기화 ──────────────────────────
    await initDB();
    addLog('db', 'RxDB 초기화 완료');

    await saveTicker('KRW-BTC', 130000000);
    await saveTicker('KRW-ETH', 5000000);
    addLog('db', '더미 데이터 저장 완료');

    await getTickers();
    addLog('db', 'RxDB 데이터 조회 완료');

    // ── wagmi ────────────────────────────────
    document.getElementById('wallet-connect-btn').onclick = async () => {
        try {
            const result = await connectWallet();
            const address = result.accounts[0];
            addLog('wallet', `지갑 연결 - ${address.slice(0, 6)}...${address.slice(-4)}`);
            document.getElementById('wallet-status').textContent =
                `Wallet: ✅ ${address.slice(0, 6)}...${address.slice(-4)}`;
        } catch (err) {
            addLog('error', `지갑 연결 실패: ${err.message}`);
        }
    };

    document.getElementById('wallet-disconnect-btn').onclick = async () => {
        try {
            await disconnectWallet();
            addLog('wallet', '지갑 연결 해제');
            document.getElementById('wallet-status').textContent = 'Wallet: 🔌 연결 해제';
        } catch (err) {
            addLog('error', `지갑 해제 실패: ${err.message}`);
        }
    };

    // ── Upbit WebSocket ───────────────────────
    connectWebSocket(['KRW-BTC', 'KRW-ETH'], (data) => {
        addLog('ws', `${data.code} : ${data.trade_price?.toLocaleString()} 원`);
    },
        (status) => {
            const map = {
                connected: '✅ 연결됨',
                error:     '❌ 에러',
                closed:    '🔌 종료'
            };
            document.getElementById('ws-status').textContent = `WebSocket: ${map[status]}`;
            addLog(status === 'connected' ? 'ws' : 'error', `WebSocket ${map[status]}`);
        }
    );
}
