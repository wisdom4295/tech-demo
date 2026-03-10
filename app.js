import { initDB, saveTicker, getTickers } from './db/rxdb-setup.js';

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

    // ✅ RxDB 초기화
    await initDB();

    // 테스트: 더미 데이터 저장 후 조회
    await saveTicker('KRW-BTC', 130000000);
    await saveTicker('KRW-ETH', 5000000);
    await getTickers();
}
