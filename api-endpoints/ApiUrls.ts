//Live
const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.itfixer199.com"

//Test
// const baseUrl =
//     process.env.NEXT_PUBLIC_API_BASE_URL ||
//     "https://api-test.itfixer199.com"


// Categories
const categories = `${baseUrl}/api/category`;
// Services
const services = `${baseUrl}/api/services`;
// Products
const products = `${baseUrl}/api/product`;
// Login 
const login = `${baseUrl}/api/unified-login`;
//user
const user = `${baseUrl}/api/user`;
// email login 
const emailLogin = `${baseUrl}/api/unified-login`;
// api/verify-otp
const verifyOtp = `${baseUrl}/api/verify-otp`;

// Cart 
const cartApi = `${baseUrl}/api/cart`;

// zone/by-location
const zoneByLocation = `${baseUrl}/api/zone/by-location`;

// Address
const address = `${baseUrl}/api/address`;
const addressFlags = `${baseUrl}/api/address/flags`;

// selectedAddress
const selectedAddress = `${baseUrl}/api/user/my-selected-address`;

// myAddress
const myAddress = `${baseUrl}/api/user/my-address`;

// App Settings 
const appSettings = `${baseUrl}/api/app-settings`;

// orderCheckout
const orderCheckout = `${baseUrl}/api/order/checkout/`;

// Orders
const orders = `${baseUrl}/api/order/orders/`;

// Requests
const requests = `${baseUrl}/api/request/`;

// slotChange
const slotChange = `${baseUrl}/api/request/slot-change/`;

// requestCancellation
const requestCancellation = `${baseUrl}/api/request/cancellation/`;

// requestRefund
const requestRefund = `${baseUrl}/api/request/refund/`;

// Third Party
const getIp = `${baseUrl}/api/third-party/get-ip/`;

// Logout
const logout = `${baseUrl}/api/logout/`;

// Get User Detail
const getUser = `${baseUrl}/api/user/`;
const updateUser = `${baseUrl}/api/user/`;


export default {
    categories,
    services,
    products,
    login,
    logout,
    getUser,
    updateUser,
    user,
    emailLogin,
    verifyOtp,
    getIp,
    cartApi,
    zoneByLocation,
    address,
    addressFlags,
    selectedAddress,
    myAddress,
    appSettings,
    orderCheckout,
    orders,
    requests,
    slotChange,
    requestCancellation,
    requestRefund,
}
