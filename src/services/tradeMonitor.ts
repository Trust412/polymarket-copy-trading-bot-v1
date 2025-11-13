import moment from 'moment';
import { ENV } from '../config/env';
import { UserActivityInterface, UserPositionInterface } from '../interfaces/User';
import { getUserActivityModel, getUserPositionModel } from '../models/userHistory';
import fetchData from '../utils/fetchData';

const USER_ADDRESS = ENV.USER_ADDRESS;
const TOO_OLD_TIMESTAMP = ENV.TOO_OLD_TIMESTAMP;
const FETCH_INTERVAL = ENV.FETCH_INTERVAL;

if (!USER_ADDRESS) {
    throw new Error('USER_ADDRESS is not defined');
}

const UserActivity = getUserActivityModel(USER_ADDRESS);
const UserPosition = getUserPositionModel(USER_ADDRESS);

let temp_trades: UserActivityInterface[] = [];

const init = async () => {
    temp_trades = (await UserActivity.find().exec()).map((trade) => trade as UserActivityInterface);
};

const fetchTradeData = async () => {
    try {
        // 從 Polymarket Data API 獲取用戶活動
        const activities: any[] = await fetchData(
            `https://data-api.polymarket.com/activity?user=${USER_ADDRESS}&type=TRADE`
        );

        if (!activities || activities.length === 0) {
            return;
        }

        // 過濾出新的交易（不在 temp_trades 中的）
        const newTrades = activities.filter((activity) => {
            // 檢查是否已存在於 temp_trades 中
            const exists = temp_trades.some(
                (trade) =>
                    trade.transactionHash === activity.transactionHash &&
                    trade.timestamp === activity.timestamp &&
                    trade.conditionId === activity.conditionId
            );

            // 檢查交易是否太舊（根據 TOO_OLD_TIMESTAMP 設定）
            const currentTime = moment().unix();
            const tradeTime = activity.timestamp;
            const hoursDiff = (currentTime - tradeTime) / 3600;
            const isTooOld = hoursDiff > TOO_OLD_TIMESTAMP;

            return !exists && !isTooOld;
        });

        // 如果有新交易，保存到資料庫
        if (newTrades.length > 0) {
            console.log(`Found ${newTrades.length} new trade(s) from user ${USER_ADDRESS}`);

            for (const trade of newTrades) {
                // 設定機器人相關的初始值，並確保所有必要欄位都存在
                const tradeData = {
                    ...trade,
                    eventSlug: trade.eventSlug || '',
                    bio: trade.bio || '',
                    profileImageOptimized: trade.profileImageOptimized || trade.profileImage || '',
                    bot: false,              // 尚未被機器人執行
                    botExcutedTime: 0,       // 執行次數為 0
                };

                try {
                    // 保存到 MongoDB
                    const newActivity = new UserActivity(tradeData);
                    await newActivity.save();

                    // 添加到內存陣列
                    temp_trades.push(tradeData as UserActivityInterface);

                    console.log(`✅ New trade saved: ${trade.type} ${trade.side} ${trade.size} @ ${trade.price}`);
                    console.log(`   Market: ${trade.title}`);
                    console.log(`   Hash: ${trade.transactionHash}`);
                } catch (saveError) {
                    console.error('Error saving trade to database:', saveError);
                    console.error('Trade data:', tradeData);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching trade data:', error);
        // 不拋出錯誤，避免中斷監控循環
    }
};

const tradeMonitor = async () => {
    console.log('Trade Monitor is running every', FETCH_INTERVAL, 'seconds');
    await init();    //Load my oders before sever downs
    while (true) {
        await fetchTradeData();     //Fetch all user activities
        await new Promise((resolve) => setTimeout(resolve, FETCH_INTERVAL * 1000));     //Fetch user activities every second
    }
};

export default tradeMonitor;
