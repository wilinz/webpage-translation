var sourceLangList = $("#source-language-selector");
var targetLangList = $("#target-language-selector");
sourceLangList.append("<option value=\"auto\">\u81EA\u52A8\u8BC6\u522B</option>");
for (var _i = 0, languages_1 = languages; _i < languages_1.length; _i++) {
    var language = languages_1[_i];
    var option = "<option value=\"" + language.code + "\">" + language.name + "</option>";
    sourceLangList.append(option);
    targetLangList.append(option);
}
var lang = navigator.language;
targetLangList.val(lang);
sourceLangList.val("auto");
$("#translate-page").on("click", function (ev) {
    // @ts-ignore
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // @ts-ignore
        chrome.runtime.sendMessage({ type: 'translate-page', tab_id: tabs[0].id, from: sourceLangList.val(), to: targetLangList.val() }, function (response) {
            console.log('收到来自后台的回复：' + response);
        });
    });
});
//# sourceMappingURL=popup.js.map