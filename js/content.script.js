let PostArray = [];
var lastScrollValue = 0;
var scrollPerTime = 500;
const URLs = [
    "https://www.linkedin.com/posts/margo-makrouhie-b-b4892255_activity-6607298353015345152-g3US/",
    "https://www.linkedin.com/posts/dr-ahmed-hammad-52909340_himanshumistry-inspiration-motivation-activity-6606839584070348800-YEWN/",
    "https://www.linkedin.com/posts/the-daily-sales_activity-6607259782917169152-1GZT/",
    "https://www.linkedin.com/posts/mostafa-gaber-mahmoud-1990_makinewash-app-activity-6606632997624127488-Z7pL/"
];
startAutolike = function () {
    chrome.runtime.sendMessage({ cmd: "updateLike" }, function (data) {
        if (data.isCrossed) {

        } else {
            if (window.location.href == URLs[data.todayStats.index]) {
                let post = $('div.core-rail');
                $.sleep(function () {
                    $.scrollDown('', function () {
                        $.scrollDown('', function () {
                            post.find('.feed-shared-social-actions span.reactions-react-button button').click();
                            data.todayStats.totalLike = data.todayStats.totalLike + 1;
                            data.todayStats.index = data.todayStats.index + 1;
                            if (data.todayStats.index < URLs.length) {
                                Common.setLocal({ todayStats: data.todayStats });
                                $.sleep(function () {
                                    loadUrl(URLs[data.todayStats.index]);
                                }, $.randomTime(1, 10));
                            }
                        }, 1000, 10);
                    }, 1000, 3000);

                }, $.randomTime(1, 5));

            } else {
                if (data.todayStats.index < URLs.length) {
                    $.sleep(function () {
                        loadUrl(URLs[data.todayStats.index]);
                    }, $.randomTime(1, 10));
                }
            }
        }
    })
}
$(function () {
    var ajaxObj = {
        url: SERVER_API.getMemberPosts,
        tokenRequired: true,
        type: "GET"
    };
    Common.getLocal('user', function (user) {
        
        if (user.isLoggedIn && user.data.role == "member") {
            chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: ajaxObj }, function (res) {
                console.log(res.result.data);
                if (res.isSuccess && res.result.data.length) {
                    $.forEachSeries(res.result.data, function (tribe, tribeCallback) {
                        var notLikedPosts = [];
                        var notLikedPosts = $.grep(tribe.posts, function (post) {
                            return !post.boostType || post.boostType !== 'like';
                        });
                        console.log(notLikedPosts)
                        $.forEachSeries(notLikedPosts, function (post, cb) {
                            chrome.runtime.sendMessage({ cmd: "updateLike" }, function (limitData) {
                                if (limitData.isCrossed) {

                                } else {
                                    let waitingTime = $.randomTime(1, 10);
                                    $.sleep(function () {
                                        profilePreview(post.postUrl, function (status, html) {
                                            if (status) {
                                                let postObj = {
                                                    url: SERVER_API.updatePost,
                                                    tokenRequired: true,
                                                    type: "PUT",
                                                    data: { boostType: "like" }
                                                }
                                                postObj.url = postObj.url.replace(':tribeId', tribe._id);
                                                postObj.url = postObj.url.replace(':postId', post._id);

                                                chrome.runtime.sendMessage({ cmd: "callajax", ajaxObj: postObj }, function (res) { });
                                                limitData.todayStats.totalLike = limitData.todayStats.totalLike + 1;
                                                limitData.todayStats.index = limitData.todayStats.index + 1;
                                                console.log(limitData);
                                                Common.setLocal({ todayStats: limitData.todayStats }, function () {
                                                    cb();
                                                });
                                            }
                                        });
                                    }, waitingTime);
                                }
                            });

                        },function(){
                            $.sleep(tribeCallback,3000);
                        });
                    });
                }
            });
        }
    });
});


const loadUrl = (url) => {
    window.location.href = url;
};
const getLinkAndDoLike = (post) => {
    chrome.runtime.sendMessage({ cmd: "updateLike" }, function (isLimitCrossed) {
        if (!isLimitCrossed) {
            let link = post.find('.feed-shared-actor__container-link').attr('href');
            console.log(link);
            post.find('.feed-shared-social-actions span.reactions-react-button button').click();
            $.sleep(function () {
                loadPost(function () {
                    post = post.next('.relative.ember-view');
                    if (post.length)
                        getLinkAndDoLike(post);
                });
            }, $.randomTime(1, 10));
        }
    });
}

const loadPost = (scrollDownDone) => {
    lastScrollValue = lastScrollValue + scrollPerTime;
    $.scrollDown('', scrollDownDone, 200, lastScrollValue);
}
function profilePreview(url, callback) {
    $('#iframe').remove();
    $('<iframe />', { id: 'iframe', isds: true, scrolling: 'no', class: 'profile_frame' }).appendTo($("body"));
    $("#iframe").attr("src", url).find('head');
    $("#iframe").on('load', function () {
        try {
            setTimeout(function () {
                $("#iframe").contents().children().animate({ scrollTop: 1500 }, 100).promise().then(function () {
                    setTimeout(function () {
                        $("#iframe").contents().children().animate({ scrollTop: 20 }, 200).promise().then(function () {
                            if (typeof $('#iframe')[0] == 'undefined') {
                                callback(false, "<html><body></body></html>");
                            } else {
                                let post = $("#iframe").contents().children().find('div.core-rail');
                                post.find('.feed-shared-social-actions span.reactions-react-button button').click();
                                callback(true, $('#iframe')[0].contentDocument.getElementsByTagName('html')[0].outerHTML);
                            }
                        });
                    }, 2000);
                });
            }, 500);
        } catch (e) {

            callback(false, "<html><body></body></html>");
        }
    });


}