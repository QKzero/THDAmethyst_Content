
let LastPortraitUnit = -1
const PlayerAbilities = [{panel: undefined, entindex: -1}, {panel: undefined, entindex: -1}]
const CosmeticAbilities = [{panel: undefined, entindex: -1}, {panel: undefined, entindex: -1}]

// const CommandKeys = {
//     Cast: [
//         DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1,
//         DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY2,
//     ],
//     QuickCast: [
//         DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1_QUICKCAST,
//         DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY2_QUICKCAST,
//     ],
// }

// 带有Ctrl按键相关行为的技能
// const WhiteListAbilities = [
//     "item_ward_observer",
//     "item_ward_sentry",
//     "item_ward_dispenser",
// ]

// function IsAbilityInWhiteList(ability) {
//     let boolean = false
//     const AbilityName = Abilities.GetAbilityName(ability)
//     WhiteListAbilities.forEach((v) => {
//         if (AbilityName == v) {
//             boolean = true
//             return
//         }
//     })

//     return boolean
// }

function OnSecondaryAbilityActivated(idx, bIsQuickCast, bIsClicked) {
    if (bIsClicked == undefined) bIsClicked = false
    const panel = CosmeticAbilities[idx]["panel"]
    let caster
    let ability

    if (Entities.IsControllableByPlayer(Players.GetLocalPlayerPortraitUnit(), Players.GetLocalPlayer())) {
        ability = CosmeticAbilities[idx]["entindex"]
        caster = Players.GetLocalPlayerPortraitUnit()
    } else {
        ability = PlayerAbilities[idx]["entindex"]
        caster = Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer())
    }

    if ((GameUI.IsControlDown() || bIsClicked == true) && ability != -1) {
        // 插旗子可能做不了
        if (Abilities.IsCooldownReady(ability)) {
            // Abilities.ExecuteAbility不能用于隐藏的技能
            GameEvents.SendCustomGameEventToServer("cast_secondary_ability", {ability: ability, caster: caster, playerid: Players.GetLocalPlayer()})
            if (Players.GetLocalPlayerPortraitUnit() != caster) {
                // note: 多了一个选择单位时的提示圈
                const oldSelectedUnit = Players.GetSelectedEntities(Game.GetLocalPlayerID())
                GameUI.SelectUnit(caster, false)
                oldSelectedUnit.forEach((ent, index) => {
                    GameUI.SelectUnit(ent, index != 0)
                })
            }
        } else {
            // note: 缺一个鼠标指针的冷却转圈提示 （DOTAHUDCursorCooldown id="CursorCooldown"）
            GameEvents.SendEventClientSide("dota_hud_error_message", {
                reason: 15,
                message: "dota_hud_error_ability_in_cooldown",
            });
        }
    }
}

function OnSecondaryAbilityMouseOver(idx) {
    const panel = CosmeticAbilities[idx]["panel"]
    const ability = CosmeticAbilities[idx]["entindex"]

    $.DispatchEvent("DOTAShowAbilityTooltipForEntityIndex", panel, Abilities.GetAbilityName(ability), Players.GetLocalPlayerPortraitUnit())
}

function OnSecondaryAbilityMouseOut(idx) {
    const panel = CosmeticAbilities[idx]["panel"]
    const ability = CosmeticAbilities[idx]["entindex"]

    $.DispatchEvent("DOTAHideAbilityTooltip", panel)
}

function SetKeyBind() {
    // 快捷键使用L键，设置位于scripts/custom_game/thd_secondary_ability.js

    // CommandKeys["Cast"].forEach((array, i) => {
    //     if (Game.GetKeybindForCommand(CommandKeys["Cast"][i]) != "") {
    //         GameUI.SetKeyBinding(Game.GetKeybindForCommand(CommandKeys["Cast"][i]), `CastConsumableAbility${i}`, () => OnSecondaryAbilityActivated(i, false))
    //     }
    //     if (Game.GetKeybindForCommand(CommandKeys["QuickCast"][i]) != "") {
    //         GameUI.SetKeyBinding(Game.GetKeybindForCommand(CommandKeys["QuickCast"][i]), `CastConsumableAbility${i}`, () => OnSecondaryAbilityActivated(i, true))
    //     }
    // })

    CosmeticAbilities[0]["panel"].SetDialogVariable("hotkey", "L")
    CosmeticAbilities[0]["panel"].FindChildTraverse("HotkeyCtrlModifier").style.visibility = "visible"
}

function SetCosmeticAbility(ability, unit, bForceAll) {
    if (bForceAll == undefined) bForceAll = false
    for (let i = 0; i < CosmeticAbilities.length; i++) {
        if (CosmeticAbilities[i]["entindex"] == ability && bForceAll == false) return
    }
    for (let i = 0; i < CosmeticAbilities.length; i++) {
        if (CosmeticAbilities[i]["entindex"] > -1 && bForceAll == false) continue

        if (ability != -1) {
            const image_path = `file://{images}/spellicons/${Abilities.GetAbilityTextureName(ability)}.png`
            CosmeticAbilities[i]["panel"].FindChildTraverse("AbilityImage").SetImage(image_path)
            CosmeticAbilities[i]["panel"].FindChildTraverse("Cooldown").style["opacity-mask"] = `url( "${image_path}" )`
        }

        // 记录技能entindex
        CosmeticAbilities[i]["entindex"] = ability
        if (Entities.IsControllableByPlayer(unit, Players.GetLocalPlayer())) {
            // 记录受控制单位的技能entindex
            PlayerAbilities[i]["entindex"] = ability
        }

        if (!bForceAll == true) return
    }
}

function UpdateCosmeticAbilitiesCooldown() {
    const pAbilitiesBar = FindDotaHudElement("TertiaryAbilitiesBar").FindChildTraverse("AbilityButtons")
    const children = pAbilitiesBar.Children()
    for (let i = 0; i < children.length; i++) {
        const ability = CosmeticAbilities[i]["entindex"]

        if (ability > -1) {
            const remaining = Abilities.GetCooldownTimeRemaining(ability)
            CosmeticAbilities[i]["panel"].SetDialogVariableInt("cooldown_seconds", Math.ceil(remaining))

            const pCooldown = CosmeticAbilities[i]["panel"].FindChildTraverse("Cooldown")
            if (remaining > 0) {
                pCooldown.style.visibility = "visible"

                const progress = (remaining / Abilities.GetCooldownLength(ability)) * -360
                pCooldown.FindChildTraverse("CooldownBackground").style.clip = `radial( 50.0% 75.0%, 0.0deg, ${progress}deg )`
            } else {
                pCooldown.style.visibility = null
            }
        }
    }

    $.Schedule(0.01, UpdateCosmeticAbilitiesCooldown)
}

function UpdateSecondaryAbilities() {
    const TertiaryAbilitiesBar = FindDotaHudElement("TertiaryAbilitiesBar")

    let abilityCount = 0
    for (let i = 0; i < CosmeticAbilities.length; i++) {
        const abilityPanel = CosmeticAbilities[i]["panel"]
        if (CosmeticAbilities[i]["entindex"] > -1) {
            abilityPanel.style.visibility = "visible"
            abilityCount++
        } else {
            // abilityPanel.style.visibility = null
        }
    }

    const Contents = TertiaryAbilitiesBar.FindChildTraverse("Contents")
    const Buffs = FindDotaHudElement("BuffContainer").FindChild("buffs")
    const Debuffs = FindDotaHudElement("BuffContainer").FindChild("debuffs")
    if (abilityCount > 0) {
        // 它怎么把我class删了 qwq! => 手动设置一下style >w<
        Contents.style.opacity = "1.0"
        Contents.style.transform = "none"
        dotaHud.FindChild("Hud").BHasClass("HUDFlipped") ? Buffs.style.transform = "translateY(-32px) scaleX(-1)" : Buffs.style.transform = "translateY(-32px)"
        dotaHud.FindChild("Hud").BHasClass("HUDFlipped") ? Debuffs.style.transform = "translateY(-32px) scaleX(-1)" : Debuffs.style.transform = "translateY(-32px)"
    } else {
        Contents.style.opacity = null
        Contents.style.transform = null
        Buffs.style.transform = null
        Debuffs.style.transform = null
    }
}

function UpdateSelectedPortrait() {
    const portrait_unit = Players.GetLocalPlayerPortraitUnit()
    if (portrait_unit != LastPortraitUnit) {
        // note: dota_remove_ability时不会消失 XD
        // 重置CosmeticAbilities
        SetCosmeticAbility(-1, portrait_unit, true)
        LastPortraitUnit = portrait_unit
    }

    for (let i = 0; i < Entities.GetAbilityCount(portrait_unit); i++) {
        if (Entities.GetAbility(portrait_unit, i) > -1) {
            const ability = Entities.GetAbility(portrait_unit, i)
            if (Abilities.IsCosmetic(ability, portrait_unit)) SetCosmeticAbility(ability, portrait_unit)
        }
    }

    UpdateSecondaryAbilities()

    $.Schedule(0.1, UpdateSelectedPortrait)
}

(function () {
    $.Msg("Hello from thd_secondary_ability, World!")

    const pTertiaryAbilitiesBar = FindDotaHudElement("TertiaryAbilitiesBar")
    const pAbilityButtons = pTertiaryAbilitiesBar.FindChildTraverse("AbilityButtons")
    // pTertiaryAbilitiesBar.SetAttributeInt("secondary_ability_type", 2)
    pAbilityButtons.RemoveAndDeleteChildren()
    for (let i = 0; i < 2; i++) {
        const ConsumableAbility = $.CreatePanel("DOTASecondaryAbility", pAbilityButtons, `ConsumableAbility${i}`)
        ConsumableAbility.SetDialogVariableInt("ability_charge_count", 0)
        ConsumableAbility.SetDialogVariableInt("cooldown_seconds", 0)

        // 移除原PanelEvent
        const Button = ConsumableAbility.FindChildTraverse("AbilityButtonMain")
        Button.ClearPanelEvent("onactivate")
        Button.ClearPanelEvent("onmouseover")
        Button.ClearPanelEvent("onmouseout")

        CosmeticAbilities[i]["panel"] = ConsumableAbility

        Button.SetPanelEvent("onactivate", () => OnSecondaryAbilityActivated(i, false, true))
        Button.SetPanelEvent("onmouseover", () => OnSecondaryAbilityMouseOver(i))
        Button.SetPanelEvent("onmouseout", () => OnSecondaryAbilityMouseOut(i))
    }

    UpdateSelectedPortrait()

    UpdateCosmeticAbilitiesCooldown()

    SetKeyBind()

    Game.SecondaryAbility = {}
    Game.SecondaryAbility.OnSecondaryAbilityActivated = (idx, bIsQuickCast, bIsClicked) => OnSecondaryAbilityActivated(idx, bIsQuickCast, bIsClicked)

    // GameEvents.Subscribe("keybind_changed", SetKeyBind)
})()
