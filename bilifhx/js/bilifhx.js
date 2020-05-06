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
];
const regex = [
    [/(包(.*子))/g, "bao$2"],
    [/((子.*) 包)/g, "$2bao"],
    [/(包(.*含))/g, "bao$2"],
    [/(包(.*揽))/g, "bao$2"],
    [/(吧(.{0,2}九))/g, "吧   $2"],
    [/(八(.{0,2}九))/g, "八   $2"],
    [/(([DdＤｄ][iIｉＩ])[cCｃＣ]([kKｋＫ]))/g, "$2*$3"],
    [/((?<![学练演])习)/g, "刁"],
    [/(近(\[^\p{Unified_Ideograph}\w])平)/g, "近| $2平"],
    [/(近(.?)平)/g, "近| $2平"],
];
const danger = [
    ["膜蛤", "moha"]
];

$(function () {
    const len = precision.length + regex.length + danger.length;
    $("#stat").text("现收录" + len + "条敏感词");
    $("#confirm-submit-button").on("click", contribute);
});

function check() {
    let raw_text = $("#input-textarea").html().replace(/<div>(.*?)<\/div>/g, "<br />$1").replace(/<span.*?>(.*?)<\/span>/g, "$1");
    let warning_text = raw_text,
        replace_text = raw_text;
    for (let i = 0; i < precision.length; ++i) {
        const cur = precision[i];
        warning_text = warning_text.replace(cur[0], "<span style=\"background-color:yellow;\">" + cur[0] + "</span>");
        replace_text = replace_text.replace(cur[0], cur[1]);
    }
    for (let i = 0; i < regex.length; ++i) {
        const cur = regex[i];
        warning_text = warning_text.replace(cur[0], "<span style=\"background-color:#ff9f9f;\">$1</span>");
        replace_text = replace_text.replace(cur[0], cur[1]);
    }
    for (let i = 0; i < danger.length; ++i) {
        const cur = danger[i];
        warning_text = warning_text.replace(cur[0], "<span style=\"background-color:#ff4545;\">" + cur[0] + "</span>");
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