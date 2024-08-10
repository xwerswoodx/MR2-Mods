import { MR2Globals } from "magic-research-2-modding-sdk";
import { GameState } from "magic-research-2-modding-sdk/modding-decs/backend/GameState";

export function loadIdleClickerMod(MR2: MR2Globals)
{
  MR2.registerTransformation(
    [[MR2.TransformationTags.ActionEffect, "gatherMana"]],
    "AE_GatherMana",
    "Idle Clicker Mod Buff",
    MR2.TransformationType.Multiplier,
    (state: GameState) => {
      let manaRate = MR2.calculateIncomePerSecond(state).Mana;
      if (manaRate === undefined || manaRate < 1 || typeof manaRate !== "number")
        manaRate = 1;
    
      let manaMultiplier = 1;
      if (manaRate > 1)
        manaMultiplier = manaRate * 0.025;
    
      if (manaMultiplier < 1)
        manaMultiplier = 1;

      return manaMultiplier;
    });
}