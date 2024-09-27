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

/**
 * @typedef { Record<SlotId, TableSpot } Table
 */

/**
 * @typedef {{
 * deck: Card[],
 * lost: Card[],
 * fly: Card | null,
 * table: Table,
 * end: false | 'THE END' | 'HAPPY END',
 * }} State
 */

/**
 * @typedef { |
 * { type: "MOVE_CARD", payload: Card } |
 * { type: "DEAL_CARD", payload: Card } |
 * { type: "PLAY_CARD", payload: {actor:Card, slotId:SlotId } } |
 * { type: "RELEASE_CARD", payload: SlotId } |
 * { type: "CREATE_DECK", payload: Card[] } |
 * { type: "SHUFFLE_DECK" } |
 * { type: "DRAW_CARD" }
 * } Quack
 */

/** @type {import("jsdoc-duck").Labels<Quack>} */
export const label = {
  MOVE_CARD: "MOVE_CARD",
  CREATE_DECK: "CREATE_DECK",
  SHUFFLE_DECK: "SHUFFLE_DECK",
  DRAW_CARD: "DRAW_CARD",
  PLAY_CARD: "PLAY_CARD",
  RELEASE_CARD: "RELEASE_CARD",
  DEAL_CARD: "DEAL_CARD"
};

// call the DECK -> SCENE

/*

  [ possible drag-to interaction ]

  switch card:dark from slot:LINE
    drag-to target.slot:[HERO,ACTIVE]
      if target.card != HERO && target.card:PROTECT
        taget.card.pow -=0=- card.pow
          - target.card may drop
          - card may drop
  if card:dark.power:left > 0 coniue on next entry

  drag-to target.slot:[HERO,ACTIVE:empty]
      target.card.pow -=0=- hero.pow
        - target.card may drop
        - hero may drop -> lose the game: THE_END

  switch card:light from slot:LINE
    drag-to target.slot:ACTIVE:empty
      then deploy
    drag-to target.slot:STORE:empty
      then deploy

  switch card:light from slot:STORE
  drag-to target.slot:ACTIVE:empty
    then deploy

  switch card:light from slot:ACTIVE
    if card:light:CAUSE
      drag-to target.slot.LINE:card.dark
        target.card.pow -=0=- card:light.pow
          - may card:light drop
          - may target.card drop

    if card:light:SKILL
      drag-to target.slot:HERO
        then use SKILL on HERO
      drag-to target.slot:LINE:card
        then use SKILL on target card in line
      darg-to target.slot:ACTIVE:card
        then use SKILL on target card in active
      drag-to target.slot:STORE:card
        then use SKILL on target card in store

  [ on drop card check ]

  drop HERO
    THE_END

  drop any card chek the LINE(s)
  if only 1 LINE have card
    RELEASE_CARD as many LINE:empty left, max SECENE.length

  if SCENE:empty then play until all LINE card are played

  if SCENE:empty and LINEs:empty and HERO.pow > 0
    then HAPPY_END
*/

/** @type {(card:Card, slotId: string, state: State) => State} */
export const deployCard = (card, slotId, state) => {
  if (card.type === "HERO") {
    return {...state, table: {...state.table, HERO: {...state.table.HERO, card}}}
  }
  return state;
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

/** @type {import("jsdoc-duck").Reducer<State, Quack>} */
export const reducer = (state, action) => {
  switch(action.type) {
    case "CREATE_DECK": return {...state, deck: action.payload };
    case "MOVE_CARD": return {...state, fly: action.payload, table: isPlaybleCheck(action.payload, state.table) };
    case "PLAY_CARD": return deployCard(action.payload.actor, action.payload.slotId, state);
    case "RELEASE_CARD": return releaseCard(action.payload, state);
    case "SHUFFLE_DECK": return {...state, deck: [...state.deck.sort(() => (Math.random() > .5 ? -1 : 1))]};
    default: return state;
  }
};

/** @type {State} */
export const setup = {
  deck: [],
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
  lost: [],
  end: false,
}