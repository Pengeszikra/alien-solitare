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
 *  @typedef { 'DROP' |
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
 * help: boolean,
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
 * { type: "CLEAN_TABLE" } |
 * { type: "HELP_SWITCH" } |
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
  CLEAN_TABLE: "CLEAN_TABLE",
  HELP_SWITCH: "HELP_SWITCH",
};

/** 
 * # Game Rule Manager
 * 
 * TODO will write test cases
 * @type {(card:Card, slotId: string, state: State) => State} 
 */
export const playCard = (card, slotId, state) => {
  try {
    console.log(slotId, state.fly)
    const { from, to } = state.fly;

    if (from === to) return { ...state, fly: null };

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
            [from]: { ...table[from], card: null }, [to]: { ...table[to], card },
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
              [from]: { ...table[from], card: null },
              HERO: { ...table.HERO, card: captain }
            },
            lost: [...state.lost, card],
            fly: null
          }
        }

        case _(["LINE", "ACTIVE", "STRANGE", "ENGAGE"]): {
          // console.warn('strange engage vs ally');
          const guard = table[to].card;
          if (guard?.work !== "GUARD") return state;

          const [solution, problem] = [guard.power, card.power];
          const conflict = Math.min(solution, problem);

          const captain = table.HERO.card;
          const owerhit = problem > solution
            ? Math.min(table.HERO.card.power, problem - solution)
            : 0

          console.warn('OWERHIT:: ', owerhit, captain.power);

          guard.power -= conflict;
          card.power -= conflict;
          captain.power -= owerhit;

          const guardResult = {
            ...state,
            table: {
              ...table,
              [from]: { ...table[from], card: null },
              [to]: { ...table[to], card: owerhit ? null : guard },
              HERO: { ...table.HERO, card: captain }
            },
            fly: null,
            lost: owerhit
              ? [...state.lost, card, guard]
              : [...state.lost, card],
          };

          console.warn(guardResult)
          return guardResult;
        }

        case _(["ACTIVE", "LINE", "ALLY", "ENGAGE"]): {
          if (table[to]?.card?.side !== "STRANGE") return state;
          const strange = table[to].card;
          const [solution, problem] = [card.power, strange.power];
          const conflict = Math.min(solution, problem);

          strange.power -= conflict;
          card.power -= conflict;
          const lost = [...state.lost];
          if (strange.power <= 0) lost.push(strange);
          if (card.power <= 0) lost.push(card)

          return {
            ...state,
            table: {
              ...table,
              [from]: card.power <= 0
                ? { ...table[from], card: null }
                : table[from],
              [to]: strange.power <= 0
                ? { ...table[to], card: null }
                : table[to],
            },
            fly: null,
            lost
          };
        }

        case _(["LINE", "ACTIVE", "ALLY", "FIX"]):
        case _(["STORE", "ACTIVE", "ALLY", "FIX"]): {
          // captain solution fix aka heal
          if (table[to].card) return state;
          const captain = table.HERO.card;
          const regen = Math.min(captain.maxPower - captain.power, card.power);
          captain.power += regen;
          return {
            ...state,
            table: {
              ...table,
              [from]: { ...table[from], card: null }, [to]: { ...table[to], card },
              HERO: { ...table.HERO, card: captain }
            },
            fly: null,
          };
        }

        case _(["STORE", "ACTIVE", "ALLY", "ENGAGE"]):
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
        case _(["LINE", "STORE", "ALLY", "WORTH"]):
        case _(["LINE", "STORE", "NEUTRAL", "WORTH"]):
          // console.warn('save to our store');
          return table[to].card
            ? state
            : playOnTable(table);
          ;

        case _(["LINE", "DROP", "ALLY", "FIX"]):
        case _(["LINE", "DROP", "ALLY", "SKILL"]):
        case _(["ACTIVE", "DROP", "ALLY", "SKILL"]):
        case _(["LINE", "DROP", "ALLY", "GUARD"]):
        case _(["LINE", "DROP", "ALLY", "ENGAGE"]):
        case _(["LINE", "DROP", "ALLY", "WORTH"]):
          return {
            ...state,
            table: {
              ...table,
              [from]: { ...table[from], card: null },
            },
            lost: [...state.lost, card],
            fly: null,
          };

        case _(["LINE", "ACTIVE", "ALLY", "ENGAGE"]):
        case _(["LINE", "ACTIVE", "ALLY", "GUARD"]):
        case _(["LINE", "ACTIVE", "ALLY", "SKILL"]):
          // console.warn('activate engage or guard');
          return table[to].card
            ? state
            : playOnTable(table);
          ;

        case _(["ACTIVE", "LINE", "ALLY", "SKILL"]):
          return table[to].card
            ? state
            : playOnTable({
              ...table,
              [to]: table[to].card.side === "STRANGE"
                ? { ...table[to], card: { ...table[to].card, power: table[to].card.power /= 2 | 0 } }
                : table[to]
            }, { lost: [...state.lost, card] });


        // case _(["ACTIVE", "ACTIVE", "ALLY", "SKILL"]):
        // case _(["ACTIVE", "HERO", "ALLY", "SKILL"]):
        // case _(["ACTIVE", "DROP", "ALLY", "SKILL"]):
        // case _(["ACTIVE", "STORE", "ALLY", "SKILL"]):
        //   return playOnTable(table);

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
    return { ...state, phases: "BURN_OUT" };
  }

  if (amountOfCard <= 1 && state.deck.length > 0) return { ...state, phases: "STORY_GOES_ON" };

  if (amountOfCard <= 1 && state.deck.length === 0) return { ...state, phases: "SURVIVE" };

  return state;
};

/** @type {import("jsdoc-duck").Reducer<State, Actions>} */
export const reducer = (state, action) => {
  console.log(action) // TODO: Yield :: we can live without redux devtool!
  switch (action.type) {
    case "CREATE_DECK": return { ...state, deck: action.payload.map(card => ({...card, power:card.maxPower})) };
    // case "CREATE_DECK": return { ...state, deck: action.payload.map((card) => ({ ...card, src: images[Math.random() * images.length | 0] })) };
    case "MOVE_CARD": return { ...state, fly: action.payload, table: isPlaybleCheck(action.payload, state.table) };
    case "PLAY_CARD": return playCard(action.payload.actor, action.payload.slotId, state);
    case "RELEASE_CARD": return releaseCard(action.payload, state);
    case "SHUFFLE_DECK": return {
      ...state, deck: [...state.deck].sort(() => (Math.random() > .5 ? -1 : 1))
        // .slice(0, 22) // TODO remove deck size limit
    };
    case "DRAG_START": return { ...state, fly: action.payload };
    case "DRAG_END": return { ...state, fly: { ...state.fly, to: action.payload } };
    case "GO_ON": return action.payload !== "BEGIN"
      ? { ...state, phases: action.payload }
      : { ...setup }
      ;
    case "WHAT_IS_NEXT": return checkTheFinalCondition(state);
    case "HELP_SWITCH": return {...state, help: !state.help};
    case "CLEAN_TABLE": {
      const worthA1 = ["WORTH", "FIX"].includes(state.table.A1?.card?.work) && state.table.A1.card;
      const worthA2 = ["WORTH", "FIX"].includes(state.table.A2?.card?.work) && state.table.A2.card;
      // console.warn('clean ::', worthA1, worthA2);
      return {
        ...state,
        table: {
          ...state.table,
          A1: worthA1 ? { ...state.table.A1, card: null } : state.table.A1,
          A2: worthA2 ? { ...state.table.A2, card: null } : state.table.A2,
        },
        lost: [...state.lost, worthA1, worthA2].filter(card => card)
      }
    }
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
    DROP: { id: "DROP", card: null, slot: "DROP" },
  },
  phases: "BEGIN",
  score: 0,
  help: false,
}