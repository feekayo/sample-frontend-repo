const api = process.env.API; // stagging

// assets
export const assets = api + "/api/assets"
export const analytics = api + "/api/dashboard/analytics";
export const analytics2 = api + "/api/coin/analytics";

//user
export const login = api + "/api/auth"
export const signup = api + "/api/users"
export const forgotPassword = api + '/api/users/password/forgot';
export const fetchUser = api + "/api/users/user"
export const activateToken = api + "/api/users/phone/verify"
export const updatePassword = api + "/api/users/password"
export const verifyIdentity = api + "/api/identity";
export const bvnIdentity = api + "/api/identity/bvn";
export const idCardIdentity = api + "/api/identity/idcard";
export const faceIdentity = api + "/api/identity/face";
export const addressIdentity = api + "/api/identity/address";
export const preUsers = api + "/api/preusers";
export const createDummyUsers = api + "/api/admin/user/create";
export const admin_users = api + "/api/admin/users";
export const admin_user_advert = api + "/api/admin/users/adverthistory";
export const admin_user_bid_history = api + "/api/admin/users/bidhistory";
export const createAdmin = api + "/api/admin/create";
export const disableUserRequest = api + "/api/customerservice/request/status";
export const enableUserRequest = api + "/api/customerservice/request/activate";
export const fetchDeactivatedRequest = api + "/api/fetch/userdectivat/request";
export const fetchActivatedRequest = api + "/api//fetch/activate/request";
export const adminUpdateUserStatus = api + "/api/admin/disable/user";
export const adminEnableUserStatus = api + "/api//admin/enable/user";
export const resetPassword = api + "/api/users/password/reset";
export const log = api + "/api/user/logs"

// payment
export const userBanks = api + "/api/banks";
export const banks = "https://sandbox-api.etranzactglobal.com/banks/234";
export const fetchOutgoingPayments = api + "/api/payment/fetchoutgoingpayment";
export const fetchIncomingPayments = api + "/api/payment/fetchincomingpayment";
export const adminFetchOutgoingPayments = api + "/api/admin/users/outgoingpayment";
export const adminFetchIncomingPayments = api + "/api/admin/users/incomingpayment";
export const adminFetchActiveSales = api + "/api/admin/users/activesale";
export const adminFetchTransactions = api + "/api/admin/users/transactionhistory";
export const paymentMade = api + "/api/payment/cashpaymentmade";
export const confirmPayment = api + "/api/payment/confirm";
export const refund = api + "/api/advert/refund";

// wallet
export const createWallet = api + "/api/wallets";
export const wallet = api + "/api/wallets";
export const fetchSingleWallet = api + "/api/wallet";
export const transfer = api + "/api/wallets/transfer/coin";
export const transactions = api + "/api/transactions/history";

// deposit
export const deposit = api + "/api/wallets/deposit/btc";

// withdraw
export const withdraw = api + "/api/wallets/withdraw";

// advert
export const fetchAllAdverts = api + "/api/adverts/all";
export const fetchAdvert = api + "/api/advert";
export const userAdvert = api + "/api/adverts/user";
export const createAdvert = api + "/api/advert/create";
export const fetchAdvertBids = api + "/api/advertbids";

// watchlist
export const watchlist = api + "/api/watchlist";
export const deleteWatchlist = api + "/api/watchlist/delete";

// bid
export const createBid = api + "/api/bid/create";
export const acceptBid = api + "/api/bid/accept";
export const buyItNow = api + "/api/bid/buyitnow";
export const bidHistory = api + "/api/bidhistory";
export const participatingBids = api + "/api/bids/participating";
export const bid = api + "/api/bid";

// reconciliation
export const reconciliation = api + "/api/reconcilation/create";
export const adminFetchReconciliation = api + "/api/reconcilation/admin";
export const FetchReconciliation = api + "/api/reconcilation/user";
export const fetchSingleReconciliation = api + "/api/reconcilation/single";
export const endReconciliation = api + "/api/reconcilation/close";
export const cancelReconciliation = api + "/api/bidder/closetrade";
export const releaseCoin = api + "/api/admin/release";

//notifications
export const notification = api + "/api/notification";
export const sendNotification = api + "/api/sendNoitification";

//ticket
export const createTicket = api + "/api/ticket";
export const adminFetchTickets = api + "/api/ticket/admin";
export const fetchTickets = api + "/api/ticket/user";
export const fetchSingleTickets = api + "/api/ticket/single";
export const reopenTicket = api + "/api/ticket/reopen";

//verification
export const identity_verification = api + "/api/admin/identities";
export const verifyBvn = api + "/api/admin/identity/verify/bvn";
export const verifyIdCard = api + "/api/admin/identity/verify/id-card";
export const verifyFace = api + "/api/admin/identity/verify/face";
export const verifyAddress = api + "/api/admin/identity/verify/address";

// upload
export const uploadFile = api + "/api/upload/image";

// 2fa
export const activate2fa = api + "/api/user/enable2fa";
export const deactivate2fa = api + "/api/twofa/deactivate";
export const verify2fa = api + "/api/verify2FA";
export const verify2faLogin = api + "/api/verify2fa/login";