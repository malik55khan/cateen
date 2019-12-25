var manifestData = chrome.runtime.getManifest();
var currenInstanceOfPopup = false;
var currenInstanceOfPopupTab = false;
//Common.clearStorage();
var userName = "";
var socket = io.connect(WEB_END_POINT);
socket.on('connect', function () {

});
BROWSER.browserAction.onClicked.addListener(function (tab) {
  if (currenInstanceOfPopup) {
    BROWSER.windows.update(currenInstanceOfPopup.id, { "focused": true });
    return;
  }
  var currentScreenWidth = screen.availWidth;
    var currentScreenHeight = screen.availHeight;
    var width = 420;
    var height = 600;
    BROWSER.windows.create({
      url: BROWSER.runtime.getURL("popup.html"),
      type:"panel",focused:true,width:width,height:height,
      left:Math.round((currentScreenWidth - width)/2) + 300,
      top:Math.round((currentScreenHeight - height)/2),
  },function(createdWindow){
      currenInstanceOfPopup = createdWindow;
  });
});
BROWSER.windows.onRemoved.addListener(function(windowId){
  if(windowId === currenInstanceOfPopup.id){
      currenInstanceOfPopup = false;
  }
});





BROWSER.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //console.log(request);
  switch (request.cmd) {
    case "callajax": callAjax(request.ajaxObj, sendResponse); break;
    case "socketUserRegistration": socketUserRegistration(request.data, sendResponse); break;
  }
  return true;
});
var socketUserRegistration = function (data, callback) {
  socket.emit('registersocket', { user: data });
}
const setAjax = function (ajaxObj, sender, callback) {
  var defaultSetting = {
    dataType: "JSON",
    success: function (result) {
      sender({ isSuccess: true, result: result });
    }, error: function (err) {
      sender({ isSuccess: false, result: err });
    }
  };
  if (ajaxObj.tokenRequired) {
    Common.getLocal('user', function (user) {
      if (user.data) {
        defaultSetting.headers = { "Authorization": "JWT " + user.data.jwt }
        defaultSetting = $.extend(defaultSetting, ajaxObj);
      }

      callback(defaultSetting);
    });
  } else {
    defaultSetting = $.extend(defaultSetting, ajaxObj);
    return callback(defaultSetting);
  }
}
const callAjax = function (ajaxObj, sender) {
  setAjax(ajaxObj, sender, function (defaultSetting) {
    console.log(defaultSetting);
    $.ajax(defaultSetting);
  });

}


socket.on('paymentIntimation', function (data) {
  Common.getLocal('user', function (user) {
    if (user.data.userType == 1) return;
    user.data.name = user.data.name ? user.data.name : "User";
    chrome.notifications.create({
      type: 'basic',
      title: 'Hello ' + user.data.name,
      message: "The week has been completed, please make payment if any",
      iconUrl: 'img/icon.png'
    });
  })
});


socket.on('menuCreated', function (data) {
  Common.getLocal('user', function (user) {
    if (user.data.userType == 1) return;
    user.data.name = user.data.name ? user.data.name : "User";
    chrome.notifications.create({
      type: 'basic',
      title: 'Hello ' + user.data.name,
      message: "Lunch list has been released, please confirm your lunch",
      iconUrl: 'img/icon.png'
    });
  })
});

socket.on('menuUpdated', function (data) {
  Common.getLocal('user', function (user) {
    if (user.data.userType == 1) return;
    user.data.name = user.data.name ? user.data.name : "User";
    chrome.notifications.create({
      type: 'basic',
      title: 'Hello ' + user.data.name,
      message: "There are some changes in lunch items please check it",
      iconUrl: 'img/icon.png'
    });
  });
});
socket.on('menuFreezed', function (data) {
  Common.getLocal('user', function (user) {
    if (user.data.userType == 1) return;
    user.data.name = user.data.name ? user.data.name : "User";
    chrome.notifications.create({
      type: 'basic',
      title: 'Hello ' + user.data.name,
      message: "Today's menu items has been freezed by canteen admin",
      iconUrl: 'img/icon.png'
    });
  });
});

socket.on('orderConfirmed', function (data) {
  Common.getLocal('user', function (user) {
    if (user.data.userType == 2) return;

    chrome.notifications.create({
      type: 'basic',
      title: 'Order Confirmed',
      message: "Order has been confirmed by one of user",
      iconUrl: 'img/icon.png'
    });
  });
});

socket.on('orderCancelled', function (data) {
  Common.getLocal('user', function (user) {
    if (user.data.userType == 2) return;
    chrome.notifications.create({
      type: 'basic',
      title: 'Order Cancelled',
      message: "Order has been cancelled by one of user",
      iconUrl: 'img/icon.png'
    });
  });
});

socket.on('sendPaymentNotification', function (data) {
  Common.getLocal('user', function (user) {
    if (user.data.userType == 2) return;
    chrome.notifications.create({
      type: 'basic',
      title: 'Payment Received?',
      message: data.name+" has sent payment, please check mobile and notification",
      iconUrl: 'img/icon.png'
    });
  });
});