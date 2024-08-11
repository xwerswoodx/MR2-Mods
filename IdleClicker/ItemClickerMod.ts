import { MR2Globals } from "magic-research-2-modding-sdk";
import { loadIdleClickerMod } from "./mods/IdleClicker";

const PACKAGE = require("../package.json");

// This function is the main function where you are going to load all the logic
// and content.
// The argument MR2 is the main way you have to interact with the MR2 backend,
// and contains a ton of functions and classes that will let you build your content.
// Check the TypeScript declaration to see what are all the different things you
// have.
export function load(MR2: MR2Globals) {
  loadIdleClickerMod(MR2);
}

// In this function you will want to load things that could potentially affect
// the main game's content.
// The main purpose for this is to add new Elements or Resources.
/*
export function preload(MR2: MR2Globals) {
}
*/

// The following fields are used by the game.
// It's best to take them from package.json if possible.

// This id is used as the main way to reference your mod in-game.
export const id = PACKAGE.name;
// The name is a human-readable name for your mod.
export const name = PACKAGE.description;
// Please follow the format [major].[minor].[patch]. The game internally
// assumes the version will be in this format to check for save
// compatibility.
export const version = PACKAGE.version;
// A description that could be shown in-game.
export const description = "A MR2 mod that makes gathering mana more worthy.";
