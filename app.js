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

function showApp(clerk) {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('app').style.display = 'block';

    document.getElementById('user-info').textContent =
        `👤 ${clerk.user.primaryEmailAddress?.emailAddress}`;

    document.getElementById('sign-out-btn').onclick = () => {
        clerk.signOut().then(() => location.reload());
    };

    console.log('✅ Clerk 로그인 성공', clerk.user);
}
