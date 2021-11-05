let sourceLangList=$("#source-language-selector")
let targetLangList=$("#target-language-selector")

sourceLangList.append(`<option value="auto">自动识别</option>`)
for (const language of languages) {
    let option=`<option value="${language.code}">${language.name}</option>`
    sourceLangList.append(option)
    targetLangList.append(option)
}

var lang = navigator.language

targetLangList.val(lang)
sourceLangList.val("auto")

$("#translate-page").on("click",function (ev) {
    // @ts-ignore
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // @ts-ignore
        chrome.runtime.sendMessage({type: 'translate-page',tab_id:tabs[0].id,from:sourceLangList.val(),to:targetLangList.val()},function(response){
            console.log('收到来自后台的回复：'+ response)
        })
    });
})