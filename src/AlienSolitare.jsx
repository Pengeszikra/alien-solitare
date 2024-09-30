import { useEffect, useState } from "react";
import { useDuck } from "jsdoc-duck";
import { label, reducer, setup } from "./alienDuck";
import { cardCollection } from "./cardCollections";
import { delay } from "./utils";
import { DeckBuilder } from "./DeckBuilder";
import { GalleryDecider } from "./GalleryDecider";
import { images } from "./arts";
import { HowToPlay } from "./HowToPlay";

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
  quack.CLEAN_TABLE();
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

export const Target = ({ id, type }) => (
  <section data-zone={id} className="w-1/5 min-w-1/5 aspect-[3/4] h-full w-full rounded-2xl border border-4 p-4 border-zinc-700 border-dashed">
    <p className="text-zinc-500">{type}</p>
  </section>
)

/** 
 * @param {Object} props
 * @param {import('./alienDuck').Card} props.card
 * @param {import('./alienDuck').Quack} props.quack?
 * @param {import('./alienDuck').SlotId} props.slotId?
 * @param {import('./alienDuck').Phases} props.phases?
 * @returns {JSX.Element}
 */
export const Card = ({ card, quack, slotId, phases }) => {
  const { power, name, type, maxPower, side, id, src, work } = card;
  const [isDrag, setDrag] = useState(false);
  return (
    <section
      data-zone={id}
      className={`
      relative
      w-1/5
      min-w-1/5
      aspect-[3/5]
      h-full w-full
      rounded-2xl
      border
      border-4
      border-opacity-75
      p-4
      border-zinc-800
      text-sm
      bg-zinc-900 
      text-zinc-300
      ${isDrag ? "border-dashed" : ""}
      bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0)),url('${src}')]
      --bg-[url('${src}')]
      bg-bottom
      bg-cover
      bg-no-repeat
      hover:text-orange-300
      select-none
    `}
      draggable={!!quack?.DRAG_START && phases == "SOLITARE"}
      onDragStart={() => {
        setDrag(true);
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
      <section className="flex gap-2">
        <p className={`
          pointer-events-none
          text-green-500
          ${side === "STRANGE" ? "text-rose-400" : ""}
        `}>{work}</p>
        <p className="text-[.6rem]">{type}</p>
      </section>
    </section>
  );
}

/**
 * Renders a Slot component that can accept a card and handle drag-and-drop functionality.
 * 
 * @param {Object} props
 * @param {Partial<import('./alienDuck').TableSpot>} props.slot 
 * @param {import('./alienDuck').Quack} props.quack
 * @param {import('./alienDuck').Phases} props.phases
 * @returnsimport { images } from './arts';
 {JSX.Element}
 */
export const Slot = ({ slot: { card, id, slot }, quack, phases }) => {
  const [isOver, setOver] = useState(false);
  return (
    <pre className={`text-white ${isOver ? "opacity-50" : ""}`}
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
        ? <Card card={card} quack={quack} slotId={id} phases={phases} />
        : <Target id={id} type={slot} />
      }
    </pre>
  );
}

/** 
 * ## Something above us!
 * Something above us: aliens or worst. 
 * For solving our mankind agression we are decide: stop the war on Earth, 
 * and let's go outside and conquerer as many planet as possible - we hope to find at least one. 
 * Each political group and great company agree to start exploring a different direction!
 * 
 * @type {() => JSX.Element} 
 */
export const AlienSolitare = () => {
  const [state, quack] = useDuck(reducer, setup, label);

  useEffect(() => {
    // return quack.CREATE_DECK(cardCollection); // turn on deck building
    const phaser = async () => {
      switch (state.phases) {
        case "BEGIN": return initialSaga(quack);
        case "STORY_GOES_ON": return storyGoesOnSaga(quack);
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
      powered by: jsdoc-duck       deck: ${state.deck.length} drop: ${state.lost.length} phases: ${state.phases} score: ${state.score}
          `}
        </pre>

        <section className="grid gap-4 grid-cols-1 place-items-start w-full">
          <section className="grid gap-4 grid-cols-5">
            {[
              state.table.L1,
              state.table.L2,
              state.table.L3,
              state.table.L4,
              state.table.DROP
            ].map(slot => <Slot key={slot.id} slot={slot} quack={quack} phases={state.phases} />)}
            {[
              state.table.HERO,
              state.table.A1,
              state.table.A2,
              state.table.S1,
            ].map(slot => <Slot key={slot.id} slot={slot} quack={quack} phases={state.phases} />)}
          </section>
        </section>

        {state.phases === "BURN_OUT" && (
          <article onClick={() => quack.GO_ON("BEGIN")} className="bg-red-800 rounded-2xl text-white text-3xl p-8 absolute z-10 top-36 left-8 w-[800px] select-none">
            Mission was failed, captain you are Burn Out!
            <img src="Z0eTLnOV.jpg" className="my-4" />
            <p className="text-sm">Use the reset please (Ctrl + R) ... just a joke.</p>
          </article>
        )}

        {state.phases === "SURVIVE" && (
          <article onClick={() => quack.GO_ON("BEGIN")} className="bg-green-800 rounded-2xl text-white text-3xl p-8 absolute z-10 top-36 left-8 w-[800px] select-none">
            Congratulation captain 4 Mission!
            <img src="tFJJ4ggf.jpg" className="my-4" />
            <p className="text-sm">Use the reset please (Ctrl + R)</p>
          </article>
        )}

        <pre className="pointer-events-none select-none hidden">
          <p className="text-green-700 py-4">Near to a first working gameplay, just I documenting a lot.</p>
          {JSON.stringify({ ...state, deck: state.deck.length }, null, 2)}
        </pre>

        {/* <DeckBuilder deck={state.deck} /> */}

        {false && (
          <GalleryDecider deck={[
            ...cardCollection,
            ...cardCollection,
            ...cardCollection,
          ].map((card, index) => ({ ...card, src: images[index] }))} />
        )}

          <article className="bg-zinc-900 rounded-3xl my-4 flex gap-2 items-center px-4 w-4/5">
              <button 
                className="p2 w-[3rem] h-[3rem] my-4 text-2xl rounded-[50%] bg-orange-500 text-black block"
                onClick={() => quack.HELP_SWITCH()}
                >?</button>
               <p className="text-sm text-zinc-500">summary: drag and drop cards, to a prefect place, if top line left 1 card automatic refill. <br/>Survie: empty deck and line.</p>
            </article>
¬
        {state.help && <section className="w-[42rem]">
          <HowToPlay />
        </section>}

      </article>
    </main>
  );

}