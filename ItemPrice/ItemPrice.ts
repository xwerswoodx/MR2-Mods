import { MR2Globals } from "magic-research-2-modding-sdk";
import { GameState } from "magic-research-2-modding-sdk/modding-decs/backend/GameState";
import { Item, ItemParams } from "magic-research-2-modding-sdk/modding-decs/backend/items/Item";
import { Resource } from "magic-research-2-modding-sdk/modding-decs/backend/Resources";

export function getGameItemById(MR2: MR2Globals, id: string): Item {
  return MR2.Items.getById(id);
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
          let increment = 1;
          switch (resourceType) {
            case MR2.Resource.Mana:
              increment = 0;
              break;
            case MR2.Resource.TimePiece:
              increment = 5;
              break;
            case MR2.Resource.AirEssence:
            case MR2.Resource.EarthEssence:
            case MR2.Resource.WaterEssence:
            case MR2.Resource.FireEssence:
              increment = 0.05;
              break;
            case MR2.Resource.PoisonEssence:
              increment = 0.1;
            case MR2.Resource.MindEssence:
            case MR2.Resource.LifeEssence:
              increment = 0.15;
              break;
            case MR2.Resource.ElectricEssence:
            case MR2.Resource.DeathEssence:
              increment = 0.25;
              break;
            case MR2.Resource.HolyEssence:
            case MR2.Resource.SpaceEssence:
            case MR2.Resource.TimeEssence:
              increment = 0.5;
              break;
            default:
              increment = 1;
              break;
          }
          price += (amount || 0) * increment;
        }
  
        for (const [itemID, amount] of Object.entries(items)) {
          const item = getGameItemById(MR2, itemID);
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
