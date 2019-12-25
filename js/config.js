window.METHODS = [];
var BROWSER = chrome;
const WEB_END_POINT = "http://192.168.0.94:4444/";

const SERVER_API = {
    'login': WEB_END_POINT + "users/login",
    'register': WEB_END_POINT + "users/register",
    "addMenu": WEB_END_POINT + "menu/add",
    "getMenu": WEB_END_POINT + "menu/get",
    "freezeMenu": WEB_END_POINT + "menu/freezeTodaysMenu",
    "updateMenu": WEB_END_POINT + "menu/update",
    "addOrder": WEB_END_POINT + "order/add",
    "getTodayOrder": WEB_END_POINT + "order/get",
    "getUserAllOrders":WEB_END_POINT + "order/getOrdersOfThisWeek",
    "getUserPendingPayments":WEB_END_POINT + "order/getPreviousUnpaidOrders",
    "getSettings":WEB_END_POINT + "setting/get",
    "doUserPayment":WEB_END_POINT + "order/doUserPayment",

    "getNotifications":WEB_END_POINT + "notification/getAll",
    "updateNotification":WEB_END_POINT + "notification/update",
    "getAllUsers":WEB_END_POINT + "users/getAllUsers",
    "getAllPendingPayments":WEB_END_POINT+"payment/getAllPendingPayments",
    "verifyPayments": WEB_END_POINT+"payment/verifyPayments",
    "uploadQRCode": WEB_END_POINT+"setting/uploadQRCode",
    "uploadSetting": WEB_END_POINT+"setting/update",
    "requestPayment":WEB_END_POINT+"payment/requestPayment"
}