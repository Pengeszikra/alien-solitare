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
 * TODO: L5, L6, A3, S2 :: Space-ship / Location dynamic table size feature
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
 * score: number,
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

    if (from === to) return {...state, fly: null};

    /** @typedef {[Slot, Slot, Side, Work]} Move */

    /** @type {(m:Move) => string} */
    const _ = move => {
      const result = move.join()
      console.log(result);
      return result;
    };

    /** @type {(tabke:Table, extra:Partial<State>) => State} */
    const playOnTable = (table, extra = {}) => {
      try {
        const result = ({
          ...state,
          table: {
            ...table,
            [from]: { ...table[from], card: null },
            [to]: { ...table[to], card },
          },
          fly: null,
          ...extra,
        });
        console.log('playOnTable :: ', result)
        return result;
      } catch (error) {
        console.error(error);
        return state;
      }
    };

    /** @type {(move:Move) => State} */
    const tableRule = (move) => {
        console.log('move::', move)
        const { table } = state;
        switch (move.join()) {
          case _(["LINE", "HERO", "STRANGE", "ENGAGE"]): {
            const captain = table.HERO.card;
            const [solution, problem] = [captain.power, card.power];
            const conflict = Math.min(solution, problem);
            captain.power -= conflict;
            card.power -= conflict;

            return {
              ...state,
              table: {
                ...table,
                [from]: {...table[from], card: null},
                HERO: {...table.HERO, card: captain}
              },
              lost: [...state.lost, card],
              fly: null
            }
          }

          case _(["LINE", "ACTIVE", "STRANGE", "ENGAGE"]):
            // console.warn('strange engage vs ally');
            return playOnTable(table);

          case _(["ACTIVE", "LINE", "ALLY", "ENGAGE"]):
            // console.warn('our fornt will fight for ...');
            return playOnTable(table);

          case _(["STORE", "ACTIVE", "ALLY", "ENGAGE"]):
          case _(["STORE", "ACTIVE", "ALLY", "FIX"]):
          case _(["STORE", "ACTIVE", "ALLY", "GUARD"]):
          case _(["STORE", "ACTIVE", "ALLY", "SKILL"]):
            return table[to].card 
              ? state 
              : playOnTable(table)
              ;

          case _(["LINE", "ACTIVE", "NEUTRAL", "WORTH"]):
          case _(["LINE", "ACTIVE", "ALLY", "WORTH"]):
            return state.table[to].card 
              ? state
              : playOnTable(table, { score: state.score + card.power })
              ;

          case _(["LINE", "STORE", "ALLY", "FIX"]):
          case _(["LINE", "STORE", "ALLY", "ENGAGE"]):
          case _(["LINE", "STORE", "ALLY", "GUARD"]):
          case _(["LINE", "STORE", "ALLY", "SKILL"]):
          case _(["LINE", "STORE", "NEUTRAL", "SKILL"]):
          case _(["LINE", "STORE", "ALLY", "WORTH"]):
          case _(["LINE", "STORE", "NEUTRAL", "WORTH"]):
            // console.warn('save to our store');
            return table[to].card
              ? state
              : playOnTable(table);
              ;

          case _(["LINE", "ACTIVE", "ALLY", "ENGAGE"]):
          case _(["LINE", "ACTIVE", "ALLY", "GUARD"]):
            // console.warn('activate engage or guard');
            return table[to].card
              ? state
              : playOnTable(table);
              ;

          case _(["ACTIVE", "LINE", "ALLY", "SKILL"]):
          case _(["ACTIVE", "ACTIVE", "ALLY", "SKILL"]):
          case _(["ACTIVE", "HERO", "ALLY", "SKILL"]):
          case _(["ACTIVE", "DROP", "ALLY", "SKILL"]):
          case _(["ACTIVE", "STORE", "ALLY", "SKILL"]):
            // console.warn('use a skill:', card.name);
            return playOnTable(table);

          default: return state;
        }
    };

    return tableRule([
      state.table[from].slot,
      state.table[to].slot,
      card?.side,
      card?.work,
    ]);

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

/** @type {(state:State) => State} */
export const checkTheFinalCondition = (state) => {
  const upperLine = [
    state.table.L1,
    state.table.L2,
    state.table.L3,
    state.table.L4,
  ];

  const amountOfCard = upperLine.filter(spot => spot.card).length;

  if (
    state.table.HERO?.card?.type === "HERO" && 
    state.table.HERO.card.power <= 0 ||
    state.table.HERO.card.type !== "HERO"
  ) {
    return {...state, phases: "BURN_OUT"};
  }

  if (amountOfCard <= 1 && state.deck.length > 0 ) return { ...state, phases: "STORY_GOES_ON" };

  if (amountOfCard <= 1 && state.deck.length === 0 ) return { ...state, phases: "SURVIVE" };

  return state;
};

/** @type {import("jsdoc-duck").Reducer<State, Actions>} */
export const reducer = (state, action) => {
  console.log(action) // TODO: Yield :: we can live without redux devtool!
  switch (action.type) {
    case "CREATE_DECK": return { ...state, deck: action.payload.map((card) => ({ ...card, src: images[Math.random() * images.length | 0] })) };
    case "MOVE_CARD": return { ...state, fly: action.payload, table: isPlaybleCheck(action.payload, state.table) };
    case "PLAY_CARD": return playCard(action.payload.actor, action.payload.slotId, state);
    case "RELEASE_CARD": return releaseCard(action.payload, state);
    case "SHUFFLE_DECK": return {
      ...state, deck: [...state.deck.sort(() => (Math.random() > .5 ? -1 : 1))]
        .slice(0, 12) // TODO remove deck size limit
    };
    case "DRAG_START": return { ...state, fly: action.payload };
    case "DRAG_END": return { ...state, fly: { ...state.fly, to: action.payload } };
    case "GO_ON": return action.payload !== "BEGIN"
      ? { ...state, phases: action.payload }
      : { ...setup }
      ;
    case "WHAT_IS_NEXT": return checkTheFinalCondition(state);
    default: return state;
  }
};

/** @type {State} */
export const setup = {
  deck: [],
  lost: [],
  fly: null,
  table: {
    L1: { id: "L1", card: null, slot: "LINE" },
    L2: { id: "L2", card: null, slot: "LINE" },
    L3: { id: "L3", card: null, slot: "LINE" },
    L4: { id: "L4", card: null, slot: "LINE" },
    HERO: { id: "HERO", card: null, slot: "HERO" },
    A1: { id: "A1", card: null, slot: "ACTIVE" },
    A2: { id: "A2", card: null, slot: "ACTIVE" },
    S1: { id: "S1", card: null, slot: "STORE" },
  },
  phases: "BEGIN",
  score: 0,
}