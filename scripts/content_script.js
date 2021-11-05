var traverseNodes;
function init() {
    traverseNodes = new TraverseTextNodes();
    // @ts-ignore
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.greeting == "getText") {
            traverseNodes.reset();
            traverseNodes.traverse(document.documentElement);
            sendResponse(traverseNodes.textBlockArray);
            // textBlockArray.length = 0
            // console.log(t.textBlockArray)
            for (var _i = 0, _a = traverseNodes.textNodeArray; _i < _a.length; _i++) {
                var e = _a[_i];
                for (var _b = 0, e_1 = e; _b < e_1.length; _b++) {
                    var node_1 = e_1[_b];
                    // console.log(node.parentElement.nodeName.toLowerCase())
                }
            }
        }
        if (request.greeting == "translation") {
            var translation = request.message;
            var position = request.e_position;
            var aimNodes = traverseNodes.textNodeArray[position];
            for (var i in aimNodes) {
                var node = aimNodes[i];
                var text = translation[i];
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
        }
    });
}
var TraverseTextNodes = /** @class */ (function () {
    function TraverseTextNodes() {
        this.textBlockArray = [];
        this.textNodeArray = [];
        this.textNodeBuf = [];
        this.stringBuilder = "";
    }
    TraverseTextNodes.prototype.traverse = function (node) {
        this.traverseNodes(node);
        if (this.stringBuilder.length > 0) {
            this.textBlockArray.push(this.stringBuilder);
            this.stringBuilder = "";
            this.textNodeArray.push(this.textNodeBuf);
            this.textNodeBuf = [];
        }
    };
    TraverseTextNodes.prototype.reset = function () {
        this.textBlockArray = [];
        this.textNodeArray = [];
        this.textNodeBuf = [];
        this.stringBuilder = "";
    };
    TraverseTextNodes.prototype.handleTextNode = function (node) {
        var nodeValue;
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
        else {
            nodeValue = node.nodeValue;
        }
        if (nodeValue != null) {
            nodeValue = nodeValue.trim();
        }
        if (nodeValue !== "" && nodeValue != null) {
            //console.log(nodeValue)
            //node1.nodeValue = "测试
            if (this.stringBuilder.length + nodeValue.length > TraverseTextNodes.textBlockMaxLength) {
                this.textBlockArray.push(this.stringBuilder);
                this.stringBuilder = "";
                this.textNodeArray.push(this.textNodeBuf);
                this.textNodeBuf = [];
            }
            this.textNodeBuf.push(node);
            this.stringBuilder += (nodeValue + "\n");
        }
    };
    TraverseTextNodes.isTextNode = function (nodeName) {
        var reg = /style|script|head|body|textarea|noscript|html/;
        return !reg.test(nodeName.toLowerCase());
    };
    TraverseTextNodes.prototype.traverseNodes = function (node) {
        //判断是否是元素节点
        if (node.nodeType == 1) {
            //判断该元素节点是否有子节点
            if (node.nodeName.toLowerCase() == "input") {
                this.handleTextNode(node);
            }
            if (node.nodeName.toLowerCase() == "iframe") {
                console.log("this is a iframe,nodeType:" + node.nodeType);
                var iframe = node;
                this.traverse(iframe.contentWindow.document.documentElement);
            }
            else if (node.hasChildNodes) {
                //得到所有的子节点
                var childNodes = node.childNodes;
                //遍历所哟的子节点
                for (var i = 0; i < childNodes.length; i++) {
                    //得到具体的某个子节点
                    var child = childNodes.item(i);
                    //如果是文本节点
                    if (child.nodeType == 3 && TraverseTextNodes.isTextNode(child.parentNode.nodeName)) {
                        this.handleTextNode(child);
                    }
                    //递归遍历
                    this.traverseNodes(child);
                }
            }
        }
    };
    TraverseTextNodes.textBlockMaxLength = 5000;
    return TraverseTextNodes;
}());
init();
//# sourceMappingURL=content_script.js.map