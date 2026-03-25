const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.itfixer199.com"

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

// slotChange
const slotChange = `${baseUrl}/api/request/slot-change/`;

// requestCancellation
const requestCancellation = `${baseUrl}/api/request/cancellation/`;

// requestRefund
const requestRefund = `${baseUrl}/api/request/refund/`;


export default {
    categories,
    services,
    products,
    login,
    user,
    emailLogin,
    verifyOtp,
    cartApi,
    zoneByLocation,
    address,
    selectedAddress,
    myAddress,
    appSettings,
    orderCheckout,
    orders,
    slotChange,
    requestCancellation,
    requestRefund,
}