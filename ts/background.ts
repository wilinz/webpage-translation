// @ts-ignore
/*
chrome.browserAction.onClicked.addListener(function (tab) { //tab对象表示当前（用户点击browser action的时候）处于活动状态的tab
    // @ts-ignore
    chrome.tabs.sendMessage(tab.id, {greeting: "getText"},
        function (response) {
            for (let i = 0; i < response.length; i++) {
                googleTranslate(tab.id, response[i], i,"auto", "zh")
            }
        });
});
*/

// @ts-ignore
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        let tabId=request.tab_id
        console.log("tab id:",tabId)
        // @ts-ignore
        chrome.tabs.sendMessage(tabId, {greeting: "getText"}, function (response) {
            for (let i = 0; i < response.length; i++) {
                googleTranslate(tabId, response[i], i,request.from, request.to)
            }
        });
});

function onSucceed(tabId,i:number, result) {
    // @ts-ignore
    chrome.tabs.sendMessage(tabId, {greeting: "translate", message: result,e_position:i})
}