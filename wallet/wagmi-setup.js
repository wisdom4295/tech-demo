import { createConfig, connect, disconnect, getAccount, injected } from '@wagmi/core';
import { mainnet } from '@wagmi/core/chains';
import { http } from 'viem';

const injectedConnector = injected(); // ✅ 한 번만 생성

const config = createConfig({
    chains: [mainnet],
    connectors: [injectedConnector],
    transports: {
        [mainnet.id]: http(),
    },
});

export async function connectWallet() {
    const result = await connect(config, { connector: injectedConnector });
    console.log('✅ 지갑 연결:', result.accounts[0]);
    return result; // ← 결과만 반환, DOM 없음
}

export async function disconnectWallet() {
    await disconnect(config);
    console.log('🔌 지갑 연결 해제');
}

export function getWalletAccount() {
    return getAccount(config);
}
