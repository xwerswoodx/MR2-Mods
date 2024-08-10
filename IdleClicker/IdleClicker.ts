import { MR2Globals } from "magic-research-2-modding-sdk";
import { GameState } from "magic-research-2-modding-sdk/modding-decs/backend/GameState";

export function loadIdleClickerMod(MR2: MR2Globals)
{
  MR2.registerTransformation(
    [[MR2.TransformationTags.ActionEffect, "gatherMana"]],
    "AE_GatherMana",
    "Idle Clicker Mod Buff",
    MR2.TransformationType.Override,
    (state: GameState, params: Record<string, any>, previousValue: number) => {
      let manaRate = MR2.calculateIncomePerSecond(state).Mana;
      if (manaRate === undefined || manaRate < 1 || typeof manaRate !== "number")
        manaRate = 0;
    
      let manaMultiplier = 0;
      if (manaRate > 1)
        manaMultiplier = manaRate * 0.025;
    
      if (manaMultiplier < 0)
        manaMultiplier = 0;

      return previousValue + manaMultiplier;
    });
}