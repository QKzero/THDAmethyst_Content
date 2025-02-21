
let TickList = {record_time: 0, server_tick: 0, counter: 0, events: []}

function FixCombatEventMessage() {
	const pCombatEvents = FindDotaHudElement("combat_events").FindChildTraverse("ToastManager")
	const children = pCombatEvents.Children()

	for (let i = Math.min(children.length, 10); i > 1; i--) {
		let pMessage = children[children.length - i]

		// 中间有不作处理的panel时，整体抬高
		if (pMessage.BHasClass("AllyEvent") || pMessage.BHasClass("EnemyEvent")) {
			TickList.counter++
		}
	}

	((counter) => {
	let event_index = 0
	// 从上往下顺序，从第一个开始
	for (let i = counter; i > 0; i--, event_index++) {
		let pMessage = children[children.length - i]
		// $.Msg(`pMessage.text => ${pMessage.FindChildTraverse("EventLabel").text}`)
		const event = TickList.events[event_index]

		while ((pMessage.BHasClass("AllyEvent") || pMessage.BHasClass("EnemyEvent")) && (i > 1)) {
			i--
			pMessage = children[children.length - i]
			// $.Msg(`pMessage.text =>>> ${pMessage.FindChildTraverse("EventLabel").text}`)
		}

		// $.Msg(`${Players.GetTeam(event.player_id)} ? ${Players.GetTeam(Game.GetLocalPlayerID())}`)
		if (Players.GetTeam(event.player_id) == Players.GetTeam(Game.GetLocalPlayerID())) {
			pMessage.AddClass("AllyEvent")
		}
		if (Players.GetTeam(event.player_id) != Players.GetTeam(Game.GetLocalPlayerID())) {
			pMessage.AddClass("EnemyEvent")
		}
	}
	})(TickList.counter)
}

// 希望有用
function WaitForEvents() {
	if (Game.Time() < TickList.record_time + 0.03) {
		$.Schedule(0.01, WaitForEvents)
	} else {
		FixCombatEventMessage()
	}
}

function ScheduleFix(event) {
	if (event.teamnumber != -1 && Players.GetTeam(Game.GetLocalPlayerID()) != event.teamnumber ) return
	// $.Msg(event)
	// 记录短时间内的多个事件
	if (event.server_tick > TickList.server_tick + 1) {
		TickList.record_time = Game.Time()
		TickList.server_tick = event.server_tick
		TickList.counter = 1
		TickList.events = []
		TickList.events.push(event)
	} else {
		TickList.record_time = Game.Time()
		TickList.counter++
		TickList.events.push(event)
	}
 
	// 集中处理
	if (TickList.counter > 1) return

	// 延迟等待CombatEvent的panel
	$.Schedule(0.01, WaitForEvents)
}

(function () {
	$.Msg("Hello from combat_event_message_fix, World!")

	GameEvents.Subscribe("dota_combat_event_message", ScheduleFix)
})()
