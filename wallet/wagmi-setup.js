import { createConfig, connect, disconnect, getAccount, injected } from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';
import { http } from 'viem';

const config = createConfig({
    chains: [mainnet],
    connectors: [injected()],
    transports: {
        [mainnet.id]: http(),
    },
});

export async function connectWallet() {
    try {
        const result = await connect(config, { connector: injected() });
        console.log('✅ 지갑 연결:', result.accounts[0]);
        document.getElementById('wallet-status').textContent =
            `Wallet: ✅ ${result.accounts[0].slice(0, 6)}...${result.accounts[0].slice(-4)}`;
        return result;
    } catch (err) {
        console.error('❌ 지갑 연결 실패:', err.message);
        document.getElementById('wallet-status').textContent =
            `Wallet: ❌ ${err.message}`;
    }
}

export async function disconnectWallet() {
    await disconnect(config);
    document.getElementById('wallet-status').textContent = 'Wallet: 🔌 연결 해제';
    console.log('🔌 지갑 연결 해제');
}

export function getWalletAccount() {
    const account = getAccount(config);
    console.log('👛 현재 지갑:', account);
    return account;
}
