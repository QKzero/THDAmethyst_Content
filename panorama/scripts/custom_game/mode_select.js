$.Msg("mode_select.js")
$.Msg("thd_multiteam_end_screen.js");
$.Msg($("#WinLabelContainer"));

GameEvents.Subscribe("ModeSelect", ModeSelect); //为所有玩家建立模式面板
GameEvents.Subscribe("BotModSelect", BotModSelect); //为所有玩家建立BOT面板
// GameEvents.Subscribe("Mod_Select_Reset", Mod_Select_Reset); //为重连的玩家建立面板
GameEvents.Subscribe("CloseGameMod", CloseGameMod); //关闭面板

//建立一个面板，用来选择模式，包括普通模式和OMG模式，OMG模式下可以选择难度和最大玩家数，最大玩家数默认为5
function ModeSelect(data) {
    $.Msg("ModeSelect") 
    $.Msg(data) 
    //总面板
    var _Mod_Box = $.CreatePanel("Panel", $.GetContextPanel(), "Mod_Box")
    _Mod_Box.AddClass("Mod_box")
    _Mod_Box.style.width = "450px"
    _Mod_Box.style.height = "500px"
    _Mod_Box.style.marginTop = "30%"
    _Mod_Box.style.marginLeft = "46%"

    //模式面板
    var _Mod_Panel = $.CreatePanel("Panel", _Mod_Box, "Mod_Panel")
    _Mod_Panel.AddClass("Change_box") 
    _Mod_Panel.style.width = "200px"
    _Mod_Panel.style.height = "200px"
    _Mod_Panel.style.marginTop = "5%"
    _Mod_Panel.style.marginLeft = "5%"

    // 暂停
    let pause_button = $.CreatePanel("Panel", _Mod_Panel, "OMG_Easy")
    pause_button.AddClass("Select_box")
    pause_button.style.marginTop= "10px"
    let pause_label = $.CreatePanel("Label", pause_button, "Mod_Label")
    pause_label.AddClass("Mod_Label")
    pause_label.text = "暂停"
    pause_label.style.color = "#FFFFFF"
    if (data.is_paused) {
        pause_label.text = pause_label.text + "√"
        pause_label.style.color = "#FF0000"
    }

    pause_label.SetPanelEvent("onactivate", function() {
        $.Msg("pause")
        if (Game.GetLocalPlayerID() == 0) {
            let new_state = pause_label.text.indexOf("√") == -1
            pause_label.text = "暂停"
            pause_label.style.color = "#FFFFFF"
            if (new_state) {
                pause_label.text = pause_label.text + "√"
                pause_label.style.color = "#FF0000"
            }
            $.Msg(new_state)
            GameEvents.SendCustomGameEventToServer("ChangeGamePause", {is_paused: new_state});
        }
    })

    // Dota乱入
    let dota_button = $.CreatePanel("Panel", _Mod_Panel, "OMG_Easy")
    dota_button.AddClass("Select_box")
    dota_button.style.marginTop= "10px"
    let dota_label = $.CreatePanel("Label", dota_button, "Mod_Label")
    dota_label.AddClass("Mod_Label")
    dota_label.text = "Dota乱入"
    dota_label.style.color = "#FFFFFF"
    if (data.dota_inter) {
        dota_label.text = dota_label.text + "√"
        dota_label.style.color = "#FF0000"
    }

    dota_label.SetPanelEvent("onactivate", function() {
        $.Msg("dota_inter")
        if (Game.GetLocalPlayerID() == 0) {
            let new_state = dota_label.text.indexOf("√") == -1
            dota_label.text = "Dota乱入"
            dota_label.style.color = "#FFFFFF"
            if (new_state) {
                dota_label.text = dota_label.text + "√"
                dota_label.style.color = "#FF0000"
            }
            $.Msg(new_state)
            GameEvents.SendCustomGameEventToServer("ChangeGameDotaInter", {dota_inter: new_state});
        }
    })

    // 关闭按钮
    let _close_button = $.CreatePanel("Button", _Mod_Panel, "Close_Button")
    _close_button.AddClass("Select_box")
    _close_button.style.margin= "10px"
    let _close_label = $.CreatePanel("Label", _close_button, "Mod_Label")
    _close_label.AddClass("Mod_Label")
    _close_label.text = "关闭"
    _close_label.style.color = "#FFFFFF"
    _close_button.SetPanelEvent("onactivate", function() {
        $.Msg("close_button")
        if (Game.GetLocalPlayerID() == 0) {
            CloseGameMod()
        }
    })
}

function BotModSelect(data) {
    BotModSet(data)
}

function BotModSet(data) {
    $.Msg("Bot_Mod_Set")
    let _Mod_Box = $("#Mod_Box")
    $.Msg(_Mod_Box)
    if (_Mod_Box == null) {
        return
    }

    // 模式区域
    let _omg_change_box = $.CreatePanel("Panel", _Mod_Box, "OMG_Change_Box")
    _omg_change_box.AddClass("Change_box")
    _omg_change_box.style.marginTop= "5%"
    _omg_change_box.style.marginLeft= "5%"

    // 难度按钮
    let _omg_easy = $.CreatePanel("Panel", _omg_change_box, "OMG_Easy")
    _omg_easy.AddClass("Select_box")
    _omg_easy.style.marginTop= "10px"
    let _omg_easy_label = $.CreatePanel("Label", _omg_easy, "Mod_Label")
    _omg_easy_label.AddClass("Mod_Label")
    _omg_easy_label.text = "简单"

    let _omg_normal = $.CreatePanel("Panel", _omg_change_box, "OMG_Normal")
    _omg_normal.AddClass("Select_box")
    _omg_normal.style.marginTop= "10px"
    let _omg_normal_label = $.CreatePanel("Label", _omg_normal, "Mod_Label")
    _omg_normal_label.AddClass("Mod_Label")
    _omg_normal_label.text = "普通"

    let _omg_hard = $.CreatePanel("Panel", _omg_change_box, "OMG_Hard")
    _omg_hard.AddClass("Select_box")
    _omg_hard.style.marginTop= "10px"
    let _omg_hard_label = $.CreatePanel("Label", _omg_hard, "Mod_Label")
    _omg_hard_label.AddClass("Mod_Label")
    _omg_hard_label.text = "困难"

    let _omg_lunatic = $.CreatePanel("Panel", _omg_change_box, "OMG_Lunatic")
    _omg_lunatic.AddClass("Select_box")
    _omg_lunatic.style.marginTop= "10px"
    let _omg_lunatic_label = $.CreatePanel("Label", _omg_lunatic, "Mod_Label")
    _omg_lunatic_label.AddClass("Mod_Label")
    _omg_lunatic_label.text = "疯狂"

    // 数据初始化
    if (data[1].Difficulty == 1) {
        ClickSetDiff(_omg_easy, _omg_easy_label)
    }else if (data[1].Difficulty == 2) {
        ClickSetDiff(_omg_normal, _omg_normal_label)
    }else if (data[1].Difficulty == 3) {
        ClickSetDiff(_omg_hard, _omg_hard_label)
    }else if (data[1].Difficulty == 4) {
        ClickSetDiff(_omg_lunatic, _omg_lunatic_label)
    }

    
    // 对所有的panel增加点击事件
    _omg_easy.SetPanelEvent("onactivate", function() {
        $.Msg("omg_easy")
        if (Game.GetLocalPlayerID() == 0) {
            ClickSetDiff(_omg_easy, _omg_easy_label)
        }
    })
    _omg_normal.SetPanelEvent("onactivate", function() {
        $.Msg("omg_normal")
        if (Game.GetLocalPlayerID() == 0) {
            ClickSetDiff(_omg_normal, _omg_normal_label)
        }
    })
    _omg_hard.SetPanelEvent("onactivate", function() {
        $.Msg("omg_hard")
        if (Game.GetLocalPlayerID() == 0) {
            ClickSetDiff(_omg_hard, _omg_hard_label)
        }
    })
    _omg_lunatic.SetPanelEvent("onactivate", function() {
        $.Msg("omg_lunatic")
        if (Game.GetLocalPlayerID() == 0) {
            ClickSetDiff(_omg_lunatic, _omg_lunatic_label)
        }
    })
    
    function ClickSetDiff(_click_panel, _click_label) {
        if (Game.GetLocalPlayerID() == 0) {
            
            let _spawn_text = _click_label.text
            // 只取前两个字符
            _spawn_text = _spawn_text.substring(0, 2)
            _omg_easy_label.text = "简单"
            _omg_easy_label.style.color = "#FFFFFF"
            _omg_normal_label.text = "普通"
            _omg_normal_label.style.color = "#FFFFFF"
            _omg_hard_label.text = "困难"
            _omg_hard_label.style.color = "#FFFFFF"
            _omg_lunatic_label.text = "疯狂"
            _omg_lunatic_label.style.color = "#FFFFFF"
            _click_label.style.color = "#FFFFFF"
            _click_label.style.color = "#FF0000"
            // 若_spawn_text有两个字符，则不执行+ "√"
            if (_spawn_text.length == 2) {
            }
            _click_label.text = _spawn_text + "√"
            let difficulty_number = 1
            if (_spawn_text == "简单") {
                difficulty_number = 1
            } else if (_spawn_text == "普通") {
                difficulty_number = 2
            } else if (_spawn_text == "困难") {
                difficulty_number = 3
            } else if (_spawn_text == "疯狂") {
                difficulty_number = 4
            }
            GameEvents.SendCustomGameEventToServer("ChangeGameDifficulty", {difficulty: difficulty_number});
        }   
    }

    // 最大玩家数
    let _omg_player_box = $.CreatePanel("Panel", _omg_change_box, "OMG_Player_Box")
    _omg_player_box.AddClass("MaxPlayer_box")
    let _omg_maxPlayer_label = $.CreatePanel("Label", _omg_player_box, "Mod_Label")
    _omg_maxPlayer_label.AddClass("Max_Label")
    _omg_maxPlayer_label.text = "最大玩家数"
    let _omg_maxPlayer_enter = $.CreatePanel("TextEntry", _omg_player_box, "OMG_MaxPlayer_Enter")
    _omg_maxPlayer_enter.AddClass("OMG_MaxPlayer_Enter")
    _omg_maxPlayer_enter.text = data[1].MaxPlayer
    // _omg_maxPlayer_enter修改事件
    _omg_maxPlayer_enter.SetPanelEvent("oninputsubmit", function() {
        $.Msg("oninputsubmit")
        if (Game.GetLocalPlayerID() == 0) {
            let _maxPlayer = _omg_maxPlayer_enter.text
            if (_maxPlayer == "") {
                _maxPlayer = _maxPlayer
            }
            GameEvents.SendCustomGameEventToServer("ChangeGameMaxPlayer", {maxPlayer: _maxPlayer});
        }
    })

}

function CloseGameMod(params) {
    $.Msg("Close_Game_Mod")
    let _Mod_Box = $("#Mod_Box")
    // 隐藏面板
    if (_Mod_Box) {
        _Mod_Box.visible = false
    }
}