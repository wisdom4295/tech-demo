import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

let db;

const tickerSchema = {
    version: 0,
    primaryKey: 'code',
    type: 'object',
    properties: {
        code:        { type: 'string', maxLength: 20 },
        trade_price: { type: 'number' },
        updated_at:  { type: 'string' },
    },
    required: ['code', 'trade_price', 'updated_at'],
};

export async function initDB() {
    db = await createRxDatabase({
        name: 'techdemo',
        storage: getRxStorageDexie(),
    });

    await db.addCollections({
        tickers: { schema: tickerSchema },
    });

    console.log('✅ RxDB 초기화 완료');
    document.getElementById('db-status').textContent = 'RxDB: ✅ 초기화 완료';
    return db;
}

export async function saveTicker(code, price) {
    await db.tickers.upsert({
        code,
        trade_price: price,
        updated_at: new Date().toISOString(),
    });
    console.log(`💾 저장: ${code} = ${price}`);
}

export async function getTickers() {
    const docs = await db.tickers.find().exec();
    console.log('📋 저장된 데이터:', docs.map(d => d.toJSON()));
    return docs;
}
