const NON_BREAKING_SPACE = "\u00A0";
// const BASE_MESSAGE_INDENT = "<img src='file://{images}/custom_game/chat_separator.png'/>\u00A0";
const CONTEXT = $.GetContextPanel();

const GUILD_TAG_COLORS = {
	[DOTATeam_t.DOTA_TEAM_GOODGUYS]: ["#3375FF", "#66FFBF", "#BF00BF", "#F3F00B", "#FF6B00"],
	[DOTATeam_t.DOTA_TEAM_BADGUYS]: ["#FE86C2", "#A1B447", "#65D9F7", "#008321", "#A46900"],
};
const DEFAULT_GUILD_TAG_COLOR = "#ffffff";

const rank_classes = ["BronzeTier", "SilverTier", "GoldTier", "PlatinumTier", "MasterTier", "GrandmasterTier"];

const C_CHAT_ENUM = {
	PLAYER_NAME: 0,
	PLAYER_COLOR: 1,
	HERO_NAME: 2,
};
const PLAYER_COLOR_MAPS = ["dota", "dota_tournament", "aa_map_5v5", "aa_map_3v3"];
const C_CHAT_ACTIONS = {
	[C_CHAT_ENUM.PLAYER_NAME]: (player_id) => {
		return Players.GetPlayerName(player_id);
	},
	[C_CHAT_ENUM.PLAYER_COLOR]: (player_id) => {
		// if (PLAYER_COLOR_MAPS.includes(MAP_NAME)) {
			return GetHEXPlayerColor(player_id)
		// } else return GameUI.GetTeamColor(Players.GetTeam(player_id));
	},
	[C_CHAT_ENUM.HERO_NAME]: (player_id) => {
		const hero_id = Players.GetPlayerHeroEntityIndex(player_id);
		if (!hero_id) return "";

		return $.Localize(Entities.GetUnitName(hero_id));
	},
};

// 懒得找位置放了 qwq?
// panorama/layout/custom_game/scripts/config.js (from overthrow3)
GameUI.CustomUIConfig().team_icons = {
	[DOTATeam_t.DOTA_TEAM_GOODGUYS]: "file://{images}/custom_game/team_icons/team_icon_tiger_01.png",
	[DOTATeam_t.DOTA_TEAM_BADGUYS]: "file://{images}/custom_game/team_icons/team_icon_monkey_01.png",
	[DOTATeam_t.DOTA_TEAM_CUSTOM_1]: "file://{images}/custom_game/team_icons/team_icon_dragon_01.png",
	[DOTATeam_t.DOTA_TEAM_CUSTOM_2]: "file://{images}/custom_game/team_icons/team_icon_dog_01.png",
	[DOTATeam_t.DOTA_TEAM_CUSTOM_3]: "file://{images}/custom_game/team_icons/team_icon_rooster_01.png",
	[DOTATeam_t.DOTA_TEAM_CUSTOM_4]: "file://{images}/custom_game/team_icons/team_icon_ram_01.png",
	[DOTATeam_t.DOTA_TEAM_CUSTOM_5]: "file://{images}/custom_game/team_icons/team_icon_rat_01.png",
	[DOTATeam_t.DOTA_TEAM_CUSTOM_6]: "file://{images}/custom_game/team_icons/team_icon_boar_01.png",
	[DOTATeam_t.DOTA_TEAM_CUSTOM_7]: "file://{images}/custom_game/team_icons/team_icon_snake_01.png",
	[DOTATeam_t.DOTA_TEAM_CUSTOM_8]: "file://{images}/custom_game/team_icons/team_icon_horse_01.png",
};

GameUI.CustomUIConfig().team_colors = {
	[1]: "#E0610E;", // Spectator team
	[DOTATeam_t.DOTA_TEAM_GOODGUYS]: "#3dd296;", // { 61, 210, 150 }	--		Teal
	[DOTATeam_t.DOTA_TEAM_BADGUYS]: "#F3C909;", // { 243, 201, 9 }		--		Yellow
	[DOTATeam_t.DOTA_TEAM_CUSTOM_1]: "#c54da8;", // { 197, 77, 168 }	--		Pink
	[DOTATeam_t.DOTA_TEAM_CUSTOM_2]: "#FF6C00;", // { 255, 108, 0 }		--		Orange
	[DOTATeam_t.DOTA_TEAM_CUSTOM_3]: "#3455FF;", // { 52, 85, 255 }		--		Blue
	[DOTATeam_t.DOTA_TEAM_CUSTOM_4]: "#65d413;", // { 101, 212, 19 }	--		Green
	[DOTATeam_t.DOTA_TEAM_CUSTOM_5]: "#815336;", // { 129, 83, 54 }		--		Brown
	[DOTATeam_t.DOTA_TEAM_CUSTOM_6]: "#1bc0d8;", // { 27, 192, 216 }	--		Cyan
	[DOTATeam_t.DOTA_TEAM_CUSTOM_7]: "#c7e40d;", // { 199, 228, 13 }	--		Olive
	[DOTATeam_t.DOTA_TEAM_CUSTOM_8]: "#8c2af4;", // { 140, 42, 244 }	--		Purple
};

GameUI.CustomUIConfig().team_colors_rgb = {
	[DOTATeam_t.DOTA_TEAM_GOODGUYS]: [61, 210, 150], // Teal
	[DOTATeam_t.DOTA_TEAM_BADGUYS]: [243, 201, 9], // Yellow
	[DOTATeam_t.DOTA_TEAM_CUSTOM_1]: [197, 77, 168], // Pink
	[DOTATeam_t.DOTA_TEAM_CUSTOM_2]: [255, 108, 0], // Orange
	[DOTATeam_t.DOTA_TEAM_CUSTOM_3]: [52, 85, 255], // Blue
	[DOTATeam_t.DOTA_TEAM_CUSTOM_4]: [101, 212, 19], // Green
	[DOTATeam_t.DOTA_TEAM_CUSTOM_5]: [129, 83, 54], // Brown
	[DOTATeam_t.DOTA_TEAM_CUSTOM_6]: [27, 192, 216], // Cyan
	[DOTATeam_t.DOTA_TEAM_CUSTOM_7]: [199, 228, 13], // Olive
	[DOTATeam_t.DOTA_TEAM_CUSTOM_8]: [140, 42, 244], // Purple
};

GameUI.GetTeamColor = (team_id) => {
	return GameUI.CustomUIConfig().team_colors[team_id] || "#ffffff";
};

GameUI.GetTeamIcon = (team_id, b_high_reso) => {
	let team_image = GameUI.CustomUIConfig().team_icons[team_id];
	if (team_image && b_high_reso) team_image = team_image.replace("/team_icons/", "/team_icons_hr/");

	return team_image || "";
};