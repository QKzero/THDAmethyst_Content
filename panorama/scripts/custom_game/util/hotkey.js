function SetKeyBinding(sKey, sName, callback_function, bHold, secondary_callback_function) {
    //	$.Msg(sKey)
    //	$.Msg(sName)
    //	$.Msg(callback_function)
    //	$.Msg(bHold)
    //	$.Msg(secondary_callback_function)

    // 因为v社的缘故，这里加个时间，使每次的command名都不一样
    var command = sName + Date.now()

    //$.Msg("HotKey Command: " + command)

    if (bHold) {
        Game.CreateCustomKeyBind(sKey, "+" + command);
    //		$.Msg("Keybind: On Hold")
    //		$.Msg("+" + command)
        Game.AddCommand("+" + command, callback_function, "", 0);
        Game.AddCommand("-" + command, secondary_callback_function, "", 0);
    } else {
        Game.CreateCustomKeyBind(sKey, command)
    //		$.Msg("Keybind: On Pressed")
        Game.AddCommand(command, callback_function, "", 0);
    }
}

(function(){
	GameUI.SetKeyBinding = SetKeyBinding;
})();