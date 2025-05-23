// const BASE_API_URL = "http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin";
const BASE_API_URL = "http://localhost:5005/api/admin";

export const Endpoints = {
    Auth: {
        LOGIN: `${BASE_API_URL}/auth/login`,
        GET: `${BASE_API_URL}/auth/get-all-admin-list`,
        UPDATE: (id: string) => `${BASE_API_URL}/auth/update-admin/${id}`,
        ADD: `${BASE_API_URL}/auth/signup`,
        DELETE: (id: string) => `${BASE_API_URL}/auth/delete-admin/${id}`,
    },
    Version: {
        GET: `${BASE_API_URL}/version/get-version`,
        UPDATE: (id: string) => `${BASE_API_URL}/version/update-version/${id}`,
    },
    AchievementCollect: {
        GET: `${BASE_API_URL}/achivement-collect/get-achivement-collect`,
    },
    DailyRewards: {
        ADD: `${BASE_API_URL}/daily-reward/add-daily-reward`,
        GET: `${BASE_API_URL}/daily-reward/get-daily-reward`,
        UPDATE: (id: string) => `${BASE_API_URL}/daily-reward/update-daily-reward/${id}`,
        DELETE: (id: string) => `${BASE_API_URL}/daily-reward/delete-daily-reward/${id}`,
    },
    FreeAdRewards: {
        ADD: `${BASE_API_URL}/free-ad/add-free-ad-reward`,
        GET: `${BASE_API_URL}/free-ad-reward/get-free-ad`,
        UPDATE: (id: string) => `${BASE_API_URL}/free-ad/update-free-ad/${id}`,
        DELETE: (id: string) => `${BASE_API_URL}/free-ad/delete-free-ad/${id}`,
    },
    GameSettings: {
        GET: `${BASE_API_URL}/game-setting/get-game-setting`,
        UPDATE: (id: string) => `${BASE_API_URL}/game-setting/update-game-setting/${id}`,
    },
    GiftBox: {
        GET: `${BASE_API_URL}/gift-box/get-gift-box`,
        UPDATE: (id: string) => `${BASE_API_URL}/gift-box/update-gift-box/${id}`,
        ADD: `${BASE_API_URL}/gift-box/add-gift-box`,
        DELETE: (id: string) => `${BASE_API_URL}/gift-box/delete-gift-box/${id}`,
    },
    InAppPurchase: {
        GET: `${BASE_API_URL}/app-purchase/get-app-purchase`,
        UPDATE: (id: string) => `${BASE_API_URL}/app-purchase/update-app-purchase/${id}`,
        ADD: `${BASE_API_URL}/app-purchase/add-app-purchase`,
        DELETE: (id: string) => `${BASE_API_URL}/app-purchase/delete-app-purchase/${id}`,
    },
    InAppPurchaseHistory: {
        GET: `${BASE_API_URL}/app-purchase-history/get-app-purchase-history`,
        UPDATE: (id: string) => `${BASE_API_URL}/app-purchase-history/update-app-purchase-history/${id}`,
        ADD: `${BASE_API_URL}/app-purchase-history/add-app-purchase-history`,
        DELETE: (id: string) => `${BASE_API_URL}/app-purchase-history/delete-app-purchase-history/${id}`,
    },
    LevelCompleteRewards: {
        GET: `${BASE_API_URL}/level/get-level`,
        UPDATE: (id: string) => `${BASE_API_URL}/level/update-level/${id}`,
        ADD: `${BASE_API_URL}/level/add-level`,
        DELETE: (id: string) => `${BASE_API_URL}/level/delete-level/${id}`,
    },
    PlayerPlant: {
        GET: `${BASE_API_URL}/player-plant/get-player-plant`,
        UPDATE: (id: string) => `${BASE_API_URL}/player-plant/update-player-plant/${id}`,
        ADD: `${BASE_API_URL}/player-plant/add-player-plant`,
        DELETE: (id: string) => `${BASE_API_URL}/player-plant/delete-player-plant/${id}`,
    },
    SocialRewards: {
        GET: `${BASE_API_URL}/social/get-social`,
        UPDATE: (id: string) => `${BASE_API_URL}/social/update-social/${id}`,
        ADD: `${BASE_API_URL}/social/add-social`,
        DELETE: (id: string) => `${BASE_API_URL}/social/delete-social/${id}`,
    },
    PuzzleConfig: {
        GET: `${BASE_API_URL}/puzzle/get-all-puzzle`,
        UPDATE: (id: string) => `${BASE_API_URL}/puzzle/update-puzzle/${id}`,
        ADD: `${BASE_API_URL}/puzzle/add-puzzle`,
    },
    Achievements: {
        GET: `${BASE_API_URL}/achivement/get-achivement`,
        UPDATE: (id: string) => `${BASE_API_URL}/achivement/update-achivement/${id}`,
        ADD: `${BASE_API_URL}/achivement/add-achivement`,
        DELETE: (id: string) => `${BASE_API_URL}/achivement/delete-achivement/${id}`,
    },
    Dashboard: {
        GET: `${BASE_API_URL}/dashboard/get-dashboard-data`,
        GET_ALL_PLAYERS: `${BASE_API_URL}/dashboard/get-all-players`,
    },
    PlayerRankProgression: {
        GET: `${BASE_API_URL}/rank-progression/get-all-rank-progression`,
        UPDATE: (id: string) => `${BASE_API_URL}/rank-progression/update-rank-progression/${id}`,
        ADD: `${BASE_API_URL}/rank-progression/add-rank-progression`,
    },
    Plant: {
        GET: `${BASE_API_URL}/plant/get-plant`,
        UPDATE: (id: string) => `${BASE_API_URL}/plant/update-plant/${id}`,
        ADD: `${BASE_API_URL}/plant/add-plant`,
        DELETE: (id: string) => `${BASE_API_URL}/plant/delete-plant/${id}`,
    },
    // TODO
    SpinWheel: {
        GET: `${BASE_API_URL}/spin-wheel/get-spin-wheel`,
        UPDATE: (id: string) => `${BASE_API_URL}/spin-wheel/update-spin-wheel/${id}`,
        ADD: `${BASE_API_URL}/spin-wheel/add-spin-wheel`,
        DELETE: (id: string) => `${BASE_API_URL}/spin-wheel/delete-spin-wheel/${id}`,
    },
};

export default Endpoints;