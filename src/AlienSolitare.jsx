import { useEffect, useState } from "react";
import { useDuck } from "jsdoc-duck";
import { label, reducer, setup } from "./alienDuck";
import { cardCollection } from "./cardCollections";
import { delay } from "./utils";
// import { DeckBuilder } from "./DeckBuilder";
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

const cardWidth = "11rem";

export const Target = ({ id, type, children }) => (
  <section
    data-zone={id}
    className={`
      relative
      w-[${cardWidth}]
      aspect-[4/6]
      rounded-2xl
      border-zinc-700
      border-dashed
      outline-dashed 
      outline-offset-0
      hover:outline-offset-4
      hover:outline-sky-600 hover:outline-2
      transition-all duration-300
      outline-zinc-700
    `}>
    <p className="text-zinc-500 select-none absolute top-4 left-4">{type}</p>
    {children}
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
      w-[${cardWidth}]
      aspect-[4/6]
      object-cover
      rounded-2xl
      border
      lg:border-4
      md:border-2
      border-opacity-75
      p-4
      border-zinc-800
      text-sm
      bg-zinc-900 
      text-zinc-300
      ${isDrag ? "border-dashed" : ""}
      overflow-hidden
      bg-[linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0)),url('${src}')]
      bg-center
      bg-cover
      bg-no-repeat
      hover:text-orange-300
      select-none
      pointer-events-none
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
 * @param {import('./alienDuck').Phases} props.fly
 * @returnsimport { images } from './arts';
 {JSX.Element}
 */
export const Slot = ({ slot: { card, id, slot }, quack, phases, fly }) => {
  return (
    <pre className={`text-white ${fly ? "opacity-50" : ""}`}
      onClick={() => {
        if (!fly) {
          quack.DRAG_START({ actor: card, from: id });
        } else {
          quack.DRAG_END(id);
          quack.PLAY_CARD({ actor: fly.actor, slotId: id })
        }
      }}
      >
      <Target id={id} type={slot}>
        {card && <Card card={card} quack={quack} slotId={id} phases={phases} />}
      </Target>
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

  useEffect(() => {
  }, [state.deck.length, state.lost.length, state.phases, state.score]);

  return (
    <main className="bg-black text-zinc-200 min-h-screen min-w-screen">
      <article className="p-4 relative max-h-screen aspect-[4/4] mx-auto">
        <pre className="select-none">A L I E N - S O L I T A R E</pre>
        <pre className="select-none mb-4">     powered by: <a href="https://www.npmjs.com/package/jsdoc-duck" target="_blank" className="text-sky-500">jsdoc-duck</a></pre>

        <section className="grid gap-[.5rem] grid-cols-1 place-items-start w-full relative">
          <section className="grid gap-[1rem] grid-cols-4">
            <p></p>
            <Slot slot={state.table.DECK} quack={quack} phases={state.phases} fly={state.fly}/>
            <Slot slot={state.table.DROP} quack={quack} phases={state.phases} fly={state.fly}/>
          </section>
          <section className="grid gap-[1rem] grid-cols-4 absolute place-items-center min-w-[46rem] top-[7rem] select-none pointer-events-none">
            <p className="select-none bg-gray-900 text-xl p-2 rounded-xl">{state.phases}</p>
            <p className="select-none bg-gray-900 text-3xl p-2 rounded-xl">{state.deck.length}</p>
            <p className="select-none bg-gray-900 text-3xl p-2 rounded-xl">{state.lost.length}</p>
            <p className="select-none bg-gray-900 text-3xl p-2 rounded-xl">{state.score}</p>
          </section>
          <section className="grid gap-[1rem] grid-cols-4">
            {[
              state.table.L1,
              state.table.L2,
              state.table.L3,
              state.table.L4,

            ].map(slot => <Slot key={slot.id} slot={slot} quack={quack} phases={state.phases} fly={state.fly}/>)}
            {[
              state.table.HERO,
              state.table.A1,
              state.table.A2,
              state.table.S1,
            ].map(slot => <Slot key={slot.id} slot={slot} quack={quack} phases={state.phases} fly={state.fly}/>)}
          </section>

          {state.phases === "BURN_OUT" && (
            <article onClick={() => quack.GO_ON("BEGIN")} className={`
              bg-red-800 rounded-2xl text-white text-3xl p-8 select-none
              absolute z-10 top-[17rem] left-0 w-[46rem] 
              delay-300:top-[0rem]
            `}>
              Mission was failed, captain you are Burn Out!
              <img src="Z0eTLnOV.jpg" className="my-4" />

              <p className="text-sm">Use the reset please (Ctrl + R) ... just a joke.</p>
            </article>
          )}

          {state.phases === "SURVIVE" && (
            <article onClick={() => quack.GO_ON("BEGIN")} className={`
            bg-green-800 rounded-2xl text-white text-3xl p-8 select-none
            transform-all duration-300 easy-in-out absolute z-10 top-0 left-8 w-[44rem]
            `}
            >
              Congratulation captain 4 Mission!
              <img src="tFJJ4ggf.jpg" className="my-4" />
              <p className="text-sm">Use the reset please (Ctrl + R)</p>
            </article>
          )}
        </section>

        <pre className="pointer-events-none select-none hidden">
          <p className="text-green-700 py-4">Near to a first working gameplay, just I documenting a lot.</p>
          {JSON.stringify({ ...state, deck: state.deck.length }, null, 2)}
        </pre>

        {/* <DeckBuilder deck={state.deck} /> */}

        {/* {false && (
          <GalleryDecider deck={[
            ...cardCollection,
            ...cardCollection,
            ...cardCollection,
          ].map((card, index) => ({ ...card, src: images[index] }))} />
        )} */}

        <button className="bg-zinc-900 rounded-xl my-4 flex gap-2 items-center px-4 w-[56rem] hidden"
          onClick={() => quack.HELP_SWITCH()}
        >
          <div className="p2 w-[3rem] h-[3rem] my-4 text-2xl rounded-[50%] bg-orange-900 text-black grid place-items-center"><p>?</p></div>
          <p className="text-sm text-zinc-500">summary: drag and drop cards, to a prefect place, if top line left 1 card automatic refill. <br />Survie: empty deck and line.</p>
        </button>

        {state.help && <section className="w-[56rem]">
          <HowToPlay />
        </section>}

      </article>
    </main>
  );

}