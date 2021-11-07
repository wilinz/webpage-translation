// noinspection TypeScriptValidateJSTypes
var traverseNodesUtil;
function init() {
    //实例化遍历文本节点工具
    traverseNodesUtil = new TraverseTextNodesUtil();
    // @ts-ignore
    // 注册chrome消息监听器
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.greeting) {
            //后台请求获取源文本
            case "getText":
                if (traverseNodesUtil.isTranslated) {
                    var j = 0;
                    for (const e of traverseNodesUtil.textNodeArray) {
                        var k = 0;
                        for (const node of e) {
                            // console.log(node.parentElement.nodeName.toLowerCase())
                            replaceNodeText(node, traverseNodesUtil.translation[j][k]);
                            k++;
                        }
                        j++;
                    }
                }
                else { //重置遍历工具
                    traverseNodesUtil.reset();
                    //遍历
                    traverseNodesUtil.traverse(document.documentElement);
                    //发送源文本给后台，文本已经分片，单片size<5000
                    sendResponse(traverseNodesUtil.textSliceArray);
                }
                break;
            //后台翻译好了，请求替换文本
            case "translate":
                var translation = request.message; //翻译结果
                var position = request.e_position; //元素索引
                traverseNodesUtil.translation.fill(null, 0, traverseNodesUtil.textNodeArray.length - 1);
                traverseNodesUtil.translation[position] = translation;
                traverseNodesUtil.translatedCount++;
                if (traverseNodesUtil.translatedCount == traverseNodesUtil.textSliceArray.length) {
                    console.log("翻译完成");
                    traverseNodesUtil.isTranslated = true;
                }
                var aimNodes = traverseNodesUtil.textNodeArray[position]; //目标节点数组
                for (let i in aimNodes) {
                    replaceNodeText(aimNodes[i], translation[i]);
                }
                break;
            case "showSourceText":
                if (traverseNodesUtil.isTranslated) {
                    var i = 0;
                    for (const e of traverseNodesUtil.textNodeArray) {
                        for (const node of e) {
                            // console.log(node.parentElement.nodeName.toLowerCase())
                            replaceNodeText(node, traverseNodesUtil.sourceText[i]);
                            i++;
                        }
                    }
                }
                break;
            case "showTranslation":
                if (traverseNodesUtil.isTranslated) {
                    var j = 0;
                    for (const e of traverseNodesUtil.textNodeArray) {
                        var k = 0;
                        for (const node of e) {
                            // console.log(node.parentElement.nodeName.toLowerCase())
                            replaceNodeText(node, traverseNodesUtil.translation[j][k]);
                            k++;
                        }
                        j++;
                    }
                }
                break;
        }
    });
}
function replaceNodeText(node, text) {
    if (node.nodeName.toLowerCase() == "input") {
        var newNode = node;
        var type = newNode.getAttribute("type");
        switch (type) {
            case "text":
            case "email":
            case "password":
                newNode.setAttribute("placeholder", text);
                break;
            default:
                newNode.setAttribute("value", text);
                break;
        }
    }
    else {
        node.nodeValue = text;
    }
}
class TraverseTextNodesUtil {
    constructor() {
        this.translatedCount = 0;
        this.isTranslated = false;
        this.translation = [];
        this.textSliceArray = []; //文本分片数组, 单片size<=5000,
        this.textNodeArray = []; //节点分片数组，索引与textSliceArray一致，方便操作
        this.textNodeSlice = []; //节点分片
        this.stringSlice = ""; //文本分片
        this.sourceText = []; //源文本
    }
    //遍历函数
    traverse(node) {
        this.traverseNodes(node);
        //遍历结束后处理剩余文本
        if (this.stringSlice.length > 0) {
            this.textSliceArray.push(this.stringSlice);
            this.stringSlice = "";
            this.textNodeArray.push(this.textNodeSlice);
            this.textNodeSlice = [];
        }
    }
    reset() {
        this.isTranslated = false;
        this.translatedCount = 0;
        this.translation = [];
        this.textSliceArray = [];
        this.textNodeArray = [];
        this.textNodeSlice = [];
        this.stringSlice = "";
    }
    handleTextNode(node) {
        var nodeValue;
        //如果是input元素，另外操作
        if (node.nodeName.toLowerCase() == "input") {
            var newNode = node;
            var type = newNode.getAttribute("type");
            switch (type) {
                case "text":
                case "email":
                case "password":
                    nodeValue = newNode.getAttribute("placeholder");
                    break;
                default:
                    nodeValue = newNode.getAttribute("value");
                    break;
            }
        }
        //否则按文本节点操作
        else {
            nodeValue = node.nodeValue;
        }
        if (nodeValue != null) {
            //去除首尾空格字符
            nodeValue = nodeValue.trim();
        }
        if (nodeValue !== "" && nodeValue != null) {
            //console.log(nodeValue)
            //node1.nodeValue = "测试
            //如果加入此文本后，字符切片大小超过5000，则将切片写入数组并清空切片
            if (this.stringSlice.length + nodeValue.length > TraverseTextNodesUtil.textBlockMaxLength) {
                this.textSliceArray.push(this.stringSlice);
                this.stringSlice = "";
                this.textNodeArray.push(this.textNodeSlice);
                this.textNodeSlice = [];
            }
            // 写入切片
            this.textNodeSlice.push(node);
            this.stringSlice += (nodeValue + "\n");
            this.sourceText.push(nodeValue);
        }
    }
    //判断是否是文本节点
    static isTextNode(nodeName) {
        var reg = /style|script|head|body|textarea|noscript|html/;
        return !reg.test(nodeName.toLowerCase());
    }
    //遍历节点
    traverseNodes(node) {
        //判断是否是元素节点
        if (node.nodeType == 1) {
            //判断该元素节点是否有子节点
            if (node.nodeName.toLowerCase() == "input") {
                this.handleTextNode(node);
            }
            else if (node.hasChildNodes) {
                //得到所有的子节点
                let childNodes = node.childNodes;
                //遍历所哟的子节点
                for (let i = 0; i < childNodes.length; i++) {
                    //得到具体的某个子节点
                    let child = childNodes.item(i);
                    //如果是文本节点
                    if (child.nodeType == 3 && TraverseTextNodesUtil.isTextNode(child.parentNode.nodeName)) {
                        this.handleTextNode(child);
                    }
                    //递归遍历
                    this.traverseNodes(child);
                }
            }
        }
    }
}
TraverseTextNodesUtil.textBlockMaxLength = 5000; //文本分片size
init();
//# sourceMappingURL=content_script.js.map