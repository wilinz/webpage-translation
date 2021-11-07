let sourceLangList = $("#source-language-selector");
let targetLangList = $("#target-language-selector");
sourceLangList.append(`<option value="auto">自动识别</option>`);
for (const language of languages) {
    let option = `<option value="${language.code}">${language.name}</option>`;
    sourceLangList.append(option);
    targetLangList.append(option);
}
var lang = navigator.language;
targetLangList.val(lang);
sourceLangList.val("auto");
function translate() {
    // @ts-ignore
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // @ts-ignore
        chrome.runtime.sendMessage({
            type: 'translate-page',
            tab_id: tabs[0].id,
            from: sourceLangList.val(),
            to: targetLangList.val()
        }, function (response) {
            console.log('收到来自后台的回复：' + response);
        });
    });
}
// $("#translate-page").on("click", function (ev) {
//     translate()
// })
$(document).ready(function () {
    $('input[type=radio][name=is-translate]').change(function () {
        var isTranslate = $(this).val();
        if (isTranslate == "true") {
            translate();
        }
        else {
            // @ts-ignore
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                // @ts-ignore
                chrome.tabs.sendMessage(tabs[0].id, { greeting: "showSourceText" }, function (response) {
                });
            });
        }
    });
});
//# sourceMappingURL=popup.js.map