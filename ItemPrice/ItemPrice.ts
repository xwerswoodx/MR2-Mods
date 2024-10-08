import { MR2Globals } from "magic-research-2-modding-sdk";
import { GameState } from "magic-research-2-modding-sdk/modding-decs/backend/GameState";
import { ItemParams } from "magic-research-2-modding-sdk/modding-decs/backend/items/Item";

export const id = "xwerswoodx_itemprice";
export const name = "Item Price Mod";
export const version = "0.0.2";
export const description = "A mod that dynamically adjusts the value of items in the game based on the resources and items used to craft them, instead of keeping their prices fixed.";

const itemPriceConfig = {
  "Mana": 0,
  "FireEssence": 0.035,
  "EarthEssence": 0.035,
  "WaterEssence": 0.035,
  "AirEssence": 0.035,
  "PoisonEssence": 0.055,
  "MindEssence": 0.075,
  "LifeEssence": 0.075,
  "ElectricEssence": 0.1,
  "DeathEssence": 0.1,
  "HolyEssence": 0.1,
  "TimeEssence": 0.2,
  "SpaceEssence": 0.2,
  "Coins": 1.0,
  "Monstium": 1.0,
  "TimePiece": 10.0
}

export function load(MR2: MR2Globals) {
  const itemList = MR2.Items.getAll();
  for (const item of itemList) {
    if (item === undefined) {
      return 0;
    }
    const defaultPrice = item.getBaseSalePrice;
    item.getBaseSalePrice = function (state: GameState, params: ItemParams): number {
      const transmutationSpell = MR2.getTransmutationSpellForItem(this);
      if (transmutationSpell !== undefined) {
        let price = 0;
        const { resources, items } = transmutationSpell.getCraftingMaterialsBase(state);

        for (const [resource, amount] of Object.entries(resources)) {
          if (resource !== undefined) {
            price += (amount || 0) * getResourceValue(resource);
            price += (amount || 0) / 2500; //Bonus price per 2500 resources
          }
        }
  
        for (const [itemID, amount] of Object.entries(items)) {
          if (itemID !== undefined) {
            const itemRef = MR2.Items.getById(itemID);
            if (itemRef !== undefined) {
              const itemPrice = itemRef.getBaseSalePrice(state, itemRef.getDefaultParams());
              price += (amount || 0) * itemPrice;
              price += price * (0.01 * (amount || 0)); //5% extra bonus per item
            }
          }
        }
        return price;
      }
      return defaultPrice.call(this, state, params);
    }
  }
}

function getResourceValue(key: string): number {
  if (itemPriceConfig && itemPriceConfig[key] !== undefined) {
    const value = itemPriceConfig[key];
    if (typeof value === "number")
    {
      return itemPriceConfig[key];
    }
  }
  return 1;
}

export function preload(MR2: MR2Globals) {}
