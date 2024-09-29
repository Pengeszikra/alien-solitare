import { useEffect, useState } from "react";
import { useDuck } from "jsdoc-duck";
import { label, reducer, setup } from "./alienDuck";
import { cardCollection } from "./cardCollections";
import { delay } from "./utils";
import { DeckBuilder } from "./DeckBuilder";


/** @type {(quack: import('./alienDuck').Quack) => void} */
const moment = 300;
const initialSaga = async (quack) => {
  await delay(moment / 2);
  quack.CREATE_DECK(cardCollection);
  quack.RELEASE_CARD('HERO'); // hero card are top on initial deck
  quack.SHUFFLE_DECK();
  quack.GO_ON("STORY_GOES_ON");
};
/** @type {(quack: import('./alienDuck').Quack) => void} */
const storyGoesOnSaga = async (quack) => {
  const moment = 300;
  await delay(moment);
  quack.RELEASE_CARD('L1');
  await delay(moment);
  quack.RELEASE_CARD('L2');
  await delay(moment);
  quack.RELEASE_CARD('L3');
  await delay(moment);
  quack.RELEASE_CARD('L4');
  await delay(moment);
  quack.GO_ON("SOLITARE");
};

export const Target = ({ id }) => (
  <section data-zone={id} className="w-[200px] h-[300px] rounded-2xl border border-4 p-4 border-zinc-700 border-dashed">
  </section>
)

/** 
 * @param {Object} props
 * @param {import('./alienDuck').Card} props.card
 * @param {import('./alienDuck').Quack} props.quack?
 * @param {import('./alienDuck').SlotId} props.slotId?
 * @returns {JSX.Element}
 */
export const Card = ({ card, quack, slotId }) => {
  const { power, name, type, maxPower, side, id, src, work } = card;
  const [isDrag, setDrag] = useState(false);
  return (
    <section
      data-zone={id}
      className={`
      relative
      w-[200px]
      h-[300px]
      rounded-2xl
      border
      border-4
      border-opacity-75
      p-4
      border-zinc-800
      text-xl
      bg-zinc-900 
      text-zinc-300
      ${isDrag ? "border-dashed" : ""}
      bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0)),url('${src}')]
      bg-height-[20%, 100%]
      bg-bottom
      bg-cover
      bg-no-repeat
      hover:text-orange-300
    `}
      draggable={!!quack?.DRAG_START}
      onDragStart={() => {
        setDrag(true);
        // console.log(`start: ${id}`);
        quack.DRAG_START({ actor: card, from: slotId })
      }}
      onDragEnd={() => {
        quack.PLAY_CARD({ actor: card, slotId })
        setDrag(false)
      }}
    >
      {type == "HERO"
        ? <p className="pointer-events-none">{power} \ {maxPower}</p>
        : <p className="pointer-events-none absolute right-4">{power}</p>
      }
      {type !== "HERO" && <p className={`
        pointer-events-none 
        ${side === "STRANGE" ? "text-zinc-600" : side === "NEUTRAL" ? "text-sky-600" : ""}
      `}>{side}</p>}
      <p className="pointer-events-none max-w-[180px] text-wrap">{name}</p>
      <p className={`
        pointer-events-none
        text-green-500
        text-sm
        ${side === "STRANGE" ? "text-rose-400" : ""}
      `}>{work}</p>
    </section>
  );
}

/**
 * Renders a Slot component that can accept a card and handle drag-and-drop functionality.
 * 
 * @param {Object} props
 * @param {Partial<import('./alienDuck').TableSpot>} props.slot 
 * @param {import('./alienDuck').Quack} props.quack
 * @returns {JSX.Element}
 */
export const Slot = ({ slot: { card, id }, quack }) => {
  const [isOver, setOver] = useState(false);
  return (
    <pre className={`text-white ${isOver ? "opacity-50" : ""}`}
      // onDragEnter={p => console.dir(p.target?.attributes?.['data-zone']?.nodeValue)}
      onDragEnter={() => { console.dir(id); setOver(true) }}
      onDragLeave={() => { setOver(false) }}
      onDragOver={(e) => { e.preventDefault() }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        quack.DRAG_END(id);
        setOver(false);
        // console.log(`end: ${id}`, card)
      }}
    >
      {card
        ? <Card card={card} quack={quack} slotId={id} />
        : <Target id={id} />
      }
    </pre>
  );
}

export const AlienGame = () => {
  const [state, quack] = useDuck(reducer, setup, label);

  useEffect(() => {
    // return quack.CREATE_DECK(cardCollection); // turn on deck building
    const phaser = async () => {
      switch (state.phases) {
        case "BEGIN": return initialSaga(quack);
        case "STORY_GOES_ON": return storyGoesOnSaga(quack);
        case "SOLITARE": return;
        case "BURN_OUT": return;
        case "SURVIVE": return;
      }
    };
    phaser();
  }, [state.phases, quack]);

  useEffect(() => {
    // console.log('check story goes on', state.fly, state.phases)
    if (state.fly === null && state.phases === "SOLITARE") {
      quack.WHAT_IS_NEXT();
    }
  }, [state.fly, state.phases, quack])

  return (
    <main className="bg-black text-zinc-200 --bg-[url('ufo-theory.png')]">
      <article className="relative p-4">
        <pre className="pointer-events-none select-none">{`
          A L I E N - S O L I T A R E
          powered by: jsdoc-duck        future:${state.deck.length} past: 0 phases:${state.phases}
          `}
        </pre>

        <section className="grid gap-4 grid-cols-1 place-items-start">
          <section className="grid gap-4 grid-cols-4">
            {[
              state.table.L1,
              state.table.L2,
              state.table.L3,
              state.table.L4
            ].map(slot => <Slot key={slot.id} slot={slot} quack={quack} />)}
          </section>
          <section className="grid gap-4 grid-cols-4">
            {[
              state.table.HERO,
              state.table.A1,
              state.table.A2,
              state.table.S1
            ].map(slot => <Slot key={slot.id} slot={slot} quack={quack} />)}
          </section>
        </section>

        <pre className="pointer-events-none select-none hidden">
          <p className="text-green-700 py-4">At this point content is a mass of chaos</p>
          {JSON.stringify({ ...state, deck: state.deck.length }, null, 2)}
        </pre>

        {/* <DeckBuilder deck={state.deck} /> */}

      </article>
    </main>
  );

}