"use strict";

var bCountdown = false

// 投票
function UrdVote(keys) {
    // 显示投票窗口
    if ($( "#UrdContainer" ).style.opacity != '1.0') {
        $( "#UrdContainer" ).style.opacity = '1.0';
    }

    const voteNum = keys.num;
    let voteNeed = keys.need;
    if (voteNeed == null) voteNeed = 4;

    $( "#VoteNum" ).SetDialogVariableInt("vote_num", voteNum);
    $( "#VoteNum" ).SetDialogVariableInt("vote_need", voteNeed);

    // 不重置倒数时间
    if (!bCountdown) {
        bCountdown = true;
        VoteCountDown(60);
    }
}

// 投票倒数
function VoteCountDown(countdown, startTime) {
    if (startTime == undefined) startTime = Game.GetGameTime();
    const nowTime = Game.GetGameTime();

    var timer = Math.max( 0, countdown - Math.floor( nowTime - startTime ) );

    $( "#VoteTip" ).SetDialogVariableInt("time", timer);

    if (timer > 0 && bCountdown == true) {
        $.Schedule( 0.1, () => VoteCountDown(countdown, startTime) );
    } else {
        // 到时间隐藏
        $( "#UrdContainer" ).style.opacity = null;
        bCountdown = false;
    }
}

// 投降
function UrdSurrender(keys) {
    // 获取队伍名本地化
    let teamName = $.Localize(keys.team)

    if (bCountdown == true) {
        bCountdown = false;
    }
    $( "#GGContainer" ).style.opacity = '1.0';

    $( "#GGMessage" ).SetDialogVariable("team", teamName);

    EndCountDown(10);
}

// 投降倒数
function EndCountDown(countdown, startTime) {
    if (startTime == undefined) startTime = Game.GetGameTime();
    const nowTime = Game.GetGameTime();

    var timer = Math.max( 0, countdown - Math.floor( nowTime - startTime ) );

    $( "#GGTimer" ).SetDialogVariableInt("time", timer);

    if (timer > 0) {
        $.Schedule( 0.1, () => EndCountDown(countdown, startTime) );
    } else {
        // 到时间隐藏
        $( "#GGContainer" ).style.opacity = null;
    }
}

function OnCloseButtonPressed() {
    $( "#UrdContainer" ).style.opacity = null;
}

(function() {
    $.Msg( "Hello from urd, World!" );

    GameEvents.Subscribe("urd_vote", UrdVote);
    GameEvents.Subscribe("urd_surrender", UrdSurrender);
})()
