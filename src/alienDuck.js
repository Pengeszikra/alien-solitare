import { images } from "./arts";

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   power: number,
 *   maxPower: number,x
 *   actionSlot: number,
 *   storeSlot: number,
 *   type: 'HERO' | 'ALIEN' | 'SPACE-SHIP' | 'LOCATION' | 'GADGET' | 'STORY' | 'LOOT',
 *   work: 'PROTECT' | 'CAUSE' | 'RAISE' | 'SKILL' | '',
 *   side: 'DARK' | 'LIGHT' | ''
 *   src: string;
 *   rule: string;
 * }} Card
 */

/**
 *  @typedef { |
 *     'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 
 *   'HERO' | 'A1' | 'A2' | 'A3' | 'S1' | 'S2'
 * } SlotId
 */

/**
 * @typedef {{
 *  id: SlotId,
 *  slot: 'LINE' | 'HERO' | 'ACTIVE' | 'STORE',
 *  card: Card | null,
 *  isTarget: boolean,
 * }} TableSpot
*/

/** @typedef { 'BEGIN' | 'STORY_GOES_ON' | 'SOLITARE' | 'THE_END' | 'HAPPY_END' } Phases */

/**
 * @typedef { Record<SlotId, TableSpot } Table
 */

/**
 * @typedef {{
 * deck: Card[],
 * lost: Card[],
 * fly: { from: SlotId, to?: SlotId, card: Card },
 * table: Table,
 * phases: Phases,
 * }} State
 */

/**
 * @typedef { |
 * { type: "MOVE_CARD", payload: Card } |
 * { type: "DEAL_CARD", payload: Card } |
 * { type: "DRAG_START", payload: {from:SlotId, card:Card} } |
 * { type: "DRAG_END", payload: SlotId } |
 * { type: "PLAY_CARD", payload: {actor:Card, slotId:SlotId } } |
 * { type: "RELEASE_CARD", payload: SlotId } |
 * { type: "CREATE_DECK", payload: Card[] } |
 * { type: "SHUFFLE_DECK" } |
 * { type: "GO_ON", payload: Phases } |
 * { type: "DRAW_CARD" }
 * } Actions
 */

/**
 * @typedef {import("jsdoc-duck").Quack<Actions>} Quack
 */

/** @type {import("jsdoc-duck").Labels<Actions>} */
export const label = {
  MOVE_CARD: "MOVE_CARD",
  CREATE_DECK: "CREATE_DECK",
  SHUFFLE_DECK: "SHUFFLE_DECK",
  DRAW_CARD: "DRAW_CARD",
  PLAY_CARD: "PLAY_CARD",
  RELEASE_CARD: "RELEASE_CARD",
  DEAL_CARD: "DEAL_CARD",
  DRAG_START: "DRAG_START",
  DRAG_END: "DRAG_END",
  GO_ON: "GO_ON",
};

/** @type {(card:Card, slotId: string, state: State) => State} */
export const deployCard = (card, slotId, state) => {
  console.log(slotId, state.fly)
  const {from, to, actor} = state.fly;
  try {
    const table = (from === to || state.table[to].card)
      ? state.table
      : {
          ...state.table,
          [from]: {...state.table[from], card: null},
          [to]: {...state.table[to], card: actor}
        }
      ;
    return {...state, table, fly: null};
  } catch (error) {
    console.error(error);
    return {...state, fly:null};
  }
};

/** @type {(card:Card, table:Table) => Table} */
export const isPlaybleCheck = (card, table) => {
  return table;
};

/** @type {(slotId:SlotId, state:State) => State} */
export const releaseCard = (slotId, state) => {
  if (state.table?.[slotId]?.card) return state;
  const [card, ...deck] = state.deck;
  const table = {...state.table, [slotId]: {...state.table[slotId], card}};
  return {...state, table, deck};
};

/** @type {import("jsdoc-duck").Reducer<State, Actions>} */
export const reducer = (state, action) => {
  switch(action.type) {
    case "CREATE_DECK": return {...state, deck: action.payload.map((card) => ({...card, src:images[Math.random() * images.length | 0]})) };
    case "MOVE_CARD": return {...state, fly: action.payload, table: isPlaybleCheck(action.payload, state.table) };
    case "PLAY_CARD": return deployCard(action.payload.actor, action.payload.slotId, state);
    case "RELEASE_CARD": return releaseCard(action.payload, state);
    case "SHUFFLE_DECK": return {...state, deck: [...state.deck.sort(() => (Math.random() > .5 ? -1 : 1))]};
    case "DRAG_START": return {...state, fly: action.payload };
    case "DRAG_END": return {...state, fly: {...state.fly, to:action.payload}};
    case "GO_ON": return {...state, phases: action.payload};
    default: return state;
  }
};

/** @type {State} */
export const setup = {
  deck: [],
  lost: [],
  fly: null,
  table: {
    L1: { id: "L1", card: null, slot: "LINE", isTarget: false },
    L2: { id: "L2", card: null, slot: "LINE", isTarget: false },
    L3: { id: "L3", card: null, slot: "LINE", isTarget: false },
    L4: { id: "L4", card: null, slot: "LINE", isTarget: false },
    HERO: { id: "HERO", card: null, slot: "HERO", isTarget: false },
    A1: { id: "A1", card: null, slot: "ACTIVE", isTarget: false },
    A2: { id: "A2", card: null, slot: "ACTIVE", isTarget: false },
    S1: { id: "S1", card: null, slot: "STORE", isTarget: false },
  },
  phases: "BEGIN",
}