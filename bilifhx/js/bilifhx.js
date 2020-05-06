const dict1 = ["1/3", "1/5", "73", "535", "586", "1989", "50万", "89年", "三分之一", "五分之一", "你是我", "敏感词", "青鸟衔风", "泽民", "锦涛", "泽东", "小平"];
const repl1 = ["1/③", "1/⑤", "⑦3", "5③5", "5⑧6", "19⑧9", "五十万", "⑧9年", "三分 之一", "五分 之一", "你是 我", "敏感 词", "青鸟 衔风", "泽 民", "锦 涛", "泽 东", "小 平"];
const dict2 = [/(包(.*子))/g, /((子.*)包)/g, /(包(.*含))/g, /(包(.*揽))/g, /(吧(.{0,2}九))/g, /(八(.{0,2}九))/g];
const repl2 = ["bao$2", "$2bao", "bao$2", "bao$2", "吧   $2", "八   $2"];
const dict3 = ["膜蛤"];
const repl3 = ["moha"];

$(function () {
    const len = dict1.length + dict2.length + dict3.length;
    $("#stat").text("现收录" + len + "条敏感词");
    $("#confirm-submit-button").on("click", contribute);
});

function check() {
    let raw_text = $("#input-textarea").html().replace(/<div>(.*?)<\/div>/g, "<br />$1").replace(/<span.*?>(.*?)<\/span>/g, "$1");
    let warning_text = raw_text,
        replace_text = raw_text;
    for (let i = 0; i < dict1.length; ++i) {
        warning_text = warning_text.replace(dict1[i], "<span style=\"background-color:yellow;\">" + dict1[i] + "</span>");
        replace_text = replace_text.replace(dict1[i], repl1[i]);
    }
    for (let i = 0; i < dict2.length; ++i) {
        warning_text = warning_text.replace(dict2[i], "<span style=\"background-color:#ff9f9f;\">$1</span>");
        replace_text = replace_text.replace(dict2[i], repl2[i]);
    }
    for (let i = 0; i < dict3.length; ++i) {
        warning_text = warning_text.replace(dict3[i], "<span style=\"background-color:#ff4545;\">" + dict3[i] + "</span>");
        replace_text = replace_text.replace(dict3[i], repl3[i]);
    }
    $("#input-textarea").html(warning_text);
    $("#result-textarea").html(replace_text);
}

function contribute() {
    if ($("#word").val() == "" || $("#replacer").val() == "" || $("#email").val() == "") {
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