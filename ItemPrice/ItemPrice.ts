import { MR2Globals } from "magic-research-2-modding-sdk";
import { GameState } from "magic-research-2-modding-sdk/modding-decs/backend/GameState";
import { ItemParams } from "magic-research-2-modding-sdk/modding-decs/backend/items/Item";
import { Resource } from "magic-research-2-modding-sdk/modding-decs/backend/Resources";

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

export function loadItemPriceMod(MR2: MR2Globals) {
  const items = MR2.Items.getAll();
  for (const item of items) {
    const defaultPrice = item.getBaseSalePrice;
    item.getBaseSalePrice = function (state: GameState, params: ItemParams): number {
      const transmutationSpell = MR2.getTransmutationSpellForItem(this);
      if (transmutationSpell) {
        let price = 0;
        const { resources, items } = transmutationSpell.getCraftingMaterials(state);
          
        for (const [resource, amount] of Object.entries(resources)) {
          const resourceType = resource as Resource;
          price += (amount || 0) * getResourceValue(resourceType.toString());
        }
  
        for (const [itemID, amount] of Object.entries(items)) {
          const item = MR2.Items.getById(itemID);
          if (item) {
            const itemPrice = item.getBaseSalePrice(state, item.getDefaultParams());
            price += (amount || 0) * itemPrice;
          }
        }
        return price;
      }
      return defaultPrice.call(this, state, params);
    }
  }
}
