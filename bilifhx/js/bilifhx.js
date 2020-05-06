const precision = [
    ["1/3", "1/③"],
    ["1/5", "1/⑤"],
    ["73", "⑦3"],
    ["535", "5③5"],
    ["586", "5⑧6"],
    ["1989", "19⑧9"],
    ["50万", "五十万"],
    ["89年", "⑧9年"],
    ["三分之一", "三分 之一"],
    ["五分之一", "五分 之一"],
    ["你是我", "你是 我"],
    ["敏感词", "敏感 词"],
    ["青鸟衔风", "青鸟 衔风"],
    ["泽民", "泽 民"],
    ["锦涛", "锦 涛"],
    ["泽东", "泽 东"],
    ["小平", "小 平"],
    ["季戊四醇", "季戊 四醇"],
    ["蛤蟆", "蛤 蟆"],
    ["苟利国家", "苟利 国家"],
    ["民主", "民 主"],
    ["皿煮", "皿 煮"],
    ["刁近", "刁 近"],
];
const regex = [
    [/(D([iI][cC][kK]))/g, "Ｄ$2"],
    [/(d([iI][cC][kK]))/g, "ｄ$2"],
    [/(N([iI][gG]{2}[aA]))/g, "Ｎ$2"],
    [/(n([iI][gG]{2}[aA]))/g, "ｎ$2"],
    [/(N([iI][gG]{2}[eE][rR]))/g, "Ｎ$2"],
    [/(n([iI][gG]{2}[eE][rR]))/g, "ｎ$2"],
    [/(C([hH][iI][nN][cK]))/g, "Ｃ$2"],
    [/(c([hH][iI][nN][cK]))/g, "ｃ$2"],
    [/(B([iI][tT][cC][hH]))/g, "Ｂ$2"],
    [/(b([iI][tT][cC][hH]))/g, "ｂ$2"],
    [/(([八吧])(.{0,2}九))/gu, "$2&#32;&#32;&#32;$3"],
    [/(庆([^\p{Unified_Ideograph}\w]*)丰)/gu, "庆||$2|丰"],
    [/(庆([\p{Unified_Ideograph}\w]{1,2})丰)/gu, "庆||$2|丰"],
    [/((?<!书)包(?![括裹]))/gu, "bαo"],
    [/((?<!书)bao(?![括裹]))/gu, "bαo"],
    [/((?<=[学练演])习(\S?[近进]))/gu, "习|$2"],
    [/((?<=[学练演])习(\s+[近进]))/gu, "习|$2"],
    [/((?<![学练演])习)/gu, "刁"],
    [/(([近进])([^\p{Unified_Ideograph}\w]*)平)/gu, "$2| $3平"],
    [/(([近进])([\p{Unified_Ideograph}\w]?)平)/gu, "$2| $3平"],
];
const danger = [
    ["习进平", "刁进| 平"],
    ["膜蛤", "moha"],
];
const dangerregex = [
    [/(刁(.{0,4})近(.{0,4})平)/gu, "刁$2进| $3平"],
];

$(function () {
    const len = precision.length + regex.length + danger.length + dangerregex.length;
    $("#stat").text("现收录" + len + "条敏感词");
});

function check() {
    let raw_text = $("#input-textarea").html().replace(/<div>(.*?)<\/div>/gu, "<br />$1").replace(/<span.*?>(.*?)<\/span>/gu, "$1");
    let warning_text = raw_text,
        replace_text = raw_text;
    for (let i = 0; i < danger.length; ++i) {
        const cur = danger[i];
        warning_text = warning_text.replace(cur[0], "<span style=\"background-color:#ff4545;\">" + cur[0] + "</span>");
        replace_text = replace_text.replace(cur[0], cur[1]);
    }
    for (let i = 0; i < regex.length; ++i) {
        const cur = regex[i];
        warning_text = warning_text.replace(cur[0], "<span style=\"background-color:#ff9f9f;\">$1</span>");
        replace_text = replace_text.replace(cur[0], cur[1]);
    }
    for (let i = 0; i < dangerregex.length; ++i) {
        const cur = dangerregex[i];
        warning_text = warning_text.replace(cur[0], "<span style=\"background-color:#ff9f9f;\">$1</span>");
        replace_text = replace_text.replace(cur[0], cur[1]);
    }
    for (let i = 0; i < precision.length; ++i) {
        const cur = precision[i];
        warning_text = warning_text.replace(cur[0], "<span style=\"background-color:yellow;\">" + cur[0] + "</span>");
        replace_text = replace_text.replace(cur[0], cur[1]);
    }
    $("#input-textarea").html(warning_text);
    $("#result-textarea").html(replace_text);
}

function contribute() {
    if ($("#word").val() == "" || $("#replacer").val() == "") {
        Alert("请完整填写表单！");
    } else
        Confirm({
            msg: "确定要提交吗？请确保你提交的词条准确无误。",
            onOk: function () {
                let obj = $("#myform").serialize();
                console.log(obj);
                $.ajax({
                    type: "post",
                    url: "https://formspree.io/mlepeoda",
                    async: true,
                    data: obj,
                    dataType: "json",
                    success: res => {
                        Alert({
                            msg: "提交成功！你的贡献将在审核后收录。",
                            onOk: function () {
                                $("#mymodal").modal("hide");
                            }
                        })
                    },
                    error: res => {
                        console.log('post error', res);
                        Alert({
                            msg: "提交失败，请重试。"
                        })
                    }
                });
            },
        });
}