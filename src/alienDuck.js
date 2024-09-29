import { images } from "./arts";

/**
 * Dictionary
 * 
 * @typedef {'HERO' | 'ALIEN' | 'SPACE-SHIP' | 'LOCATION' | 'GADGET' | 'STORY'} Kind
 * @typedef {'GUARD' | 'ENGAGE' | 'FIX' | 'SKILL' | 'WORTH'} Work
 * @typedef {'ALLY' | 'STRANGE' | 'NEUTRAL'} Side
 * @typedef {'LINE' | 'HERO' | 'ACTIVE' | 'STORE' | 'DROP'} Slot
 */

/** 
 * @typedef {{
 *   id: string,
 *   name: string,
 *   power: number,
 *   maxPower: number,
 *   actionSlot: number,
 *   storeSlot: number,
 *   type: Kind,
 *   work: Work,
 *   side: Side,
 *   src: string;
 *   rule: string;
 * }} Card
 */

/**
 * Keys of Slots or Spots I was mixing this a bit.
 * 
 *  @typedef { |
 *     'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 
 *   'HERO' | 'A1' | 'A2' | 'A3' | 'S1' | 'S2'
 * } SlotId
 */

/**
 * This is represent the whole game are
 * 
 * @typedef {{
 *  id: SlotId,
 *  slot: Slot,
 *  card: Card | null,
 *  isTarget: boolean,
 * }} TableSpot
*/

/** 
 * STORY_GOES_ON & SOLITARE :: game rounds
 * 
 * BURN_OUT means the problems are owervhelming us :: THE-END
 * 
 * SURVIVE  means we capable to handle the problem :: HAPPY-END
 * 
 * @typedef { |
 *  'BEGIN' | 
 *  'STORY_GOES_ON' | 'SOLITARE' | 
 *  'BURN_OUT' | 'SURVIVE' 
 * } Phases 
 */

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
 * { type: "CREATE_DECK", payload: Card[] } |
 * { type: "SHUFFLE_DECK" } |
 * { type: "RELEASE_CARD", payload: SlotId } |
 * { type: "DRAG_START", payload: {from:SlotId, card:Card} } |
 * { type: "MOVE_CARD", payload: Card } |
 * { type: "DRAG_END", payload: SlotId } |
 * { type: "PLAY_CARD", payload: {actor:Card, slotId:SlotId } } |
 * { type: "GO_ON", payload: Phases } |
 * { type: "WHAT_IS_NEXT" }
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
  PLAY_CARD: "PLAY_CARD",
  RELEASE_CARD: "RELEASE_CARD",
  DRAG_START: "DRAG_START",
  DRAG_END: "DRAG_END",
  GO_ON: "GO_ON",
  WHAT_IS_NEXT: "WHAT_IS_NEXT",
};

/** @type {(card:Card, slotId: string, state: State) => State} */
export const playCard = (card, slotId, state) => {
  try {
    console.log(slotId, state.fly)
    const { from, to } = state.fly;

    /** @typedef {[Slot, Slot, Side, Work]} Move */

    /** @type {(m:Move) => string} */
    const _ = move => move.join();

    /** @type {(move:Move) => void} */
    const caseHandling = (move) => {
      console.log(JSON.stringify(move));
      switch (move.join()) {
        case _(["LINE", "HERO", "STRANGE", "ENGAGE"]):
          console.warn('strange engage vs Hero');
          return;

        case _(["LINE", "ACTIVE", "STRANGE", "ENGAGE"]):
          console.warn('strange engage vs ally');
          return;

        case _(["ACTIVE", "LINE", "ALLY", "ENGAGE"]):
          console.warn('our fornt will fight for ...');
          return;

        case _(["STORE", "ACTIVE", "ALLY", "ENGAGE"]):
        case _(["STORE", "ACTIVE", "ALLY", "FIX"]):
        case _(["STORE", "ACTIVE", "ALLY", "GUARD"]):
        case _(["STORE", "ACTIVE", "ALLY", "SKILL"]):
        case _(["STORE", "ACTIVE", "ALLY", "WORTH"]):
          console.warn('something will activate');
          return;

        case _(["LINE", "STORE", "ALLY", "FIX"]):
        case _(["LINE", "STORE", "ALLY", "ENGAGE"]):
        case _(["LINE", "STORE", "ALLY", "GUARD"]):
        case _(["LINE", "STORE", "ALLY", "SKILL"]):
        case _(["LINE", "STORE", "NEUTRAL", "SKILL"]):
        case _(["LINE", "STORE", "ALLY", "WORTH"]):
        case _(["LINE", "STORE", "NEUTRAL", "WORTH"]):
          console.warn('save to our store');
          return;

        case _(["ACTIVE", "LINE", "ALLY", "SKILL"]):
        case _(["ACTIVE", "ACTIVE", "ALLY", "SKILL"]):
        case _(["ACTIVE", "HERO", "ALLY", "SKILL"]):
        case _(["ACTIVE", "DROP", "ALLY", "SKILL"]):
        case _(["ACTIVE", "STORE", "ALLY", "SKILL"]):
          console.warn('use a skill:', card.name);
          return;

        default: return state;
      }
    };

    caseHandling([
      state.table[from].slot,
      state.table[to].slot,
      card?.side,
      card?.work,
    ]);

  // if everything is oke this code are put card to a new place
    const table = (from === to || state.table[to].card)
      ? state.table
      : {
        ...state.table,
        [from]: { ...state.table[from], card: null },
        [to]: { ...state.table[to], card }
      }
      ;
    return { ...state, table, fly: null };
  } catch (error) {
    console.error(error);
    return { ...state, fly: null };
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
  const table = { ...state.table, [slotId]: { ...state.table[slotId], card } };
  return { ...state, table, deck };
};

/** @type {import("jsdoc-duck").Reducer<State, Actions>} */
export const reducer = (state, action) => {
  console.log(action) // can live without redux devtool
  switch (action.type) {
    case "CREATE_DECK": return { ...state, deck: action.payload.map((card) => ({ ...card, src: images[Math.random() * images.length | 0] })) };
    case "MOVE_CARD": return { ...state, fly: action.payload, table: isPlaybleCheck(action.payload, state.table) };
    case "PLAY_CARD": return playCard(action.payload.actor, action.payload.slotId, state);
    case "RELEASE_CARD": return releaseCard(action.payload, state);
    case "SHUFFLE_DECK": return { ...state, deck: [...state.deck.sort(() => (Math.random() > .5 ? -1 : 1))] };
    case "DRAG_START": return { ...state, fly: action.payload };
    case "DRAG_END": return { ...state, fly: { ...state.fly, to: action.payload } };
    case "GO_ON": return { ...state, phases: action.payload };
    case "WHAT_IS_NEXT": return [
      state.table.L1,
      state.table.L2,
      state.table.L3,
      state.table.L4,
    ].filter(spot => spot.card === null).length >= 3
      ? { ...state, phases: "STORY_GOES_ON" }
      : state
      ;
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