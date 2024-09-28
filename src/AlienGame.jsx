import { useEffect, useState } from "react";
import { useDuck } from "jsdoc-duck";
import { label, reducer, setup } from "./alienDuck";
import { cardCollection } from "./cardCollections";

/** @type {(ms:number) => Promise<void>} */
export const delay = (ms) => new Promise((release) => setTimeout(release, ms));

/** @type {(quack: import('./alienDuck').Quack) => void} */
const initialSaga = async (quack) => {
  await delay(200)
  quack.CREATE_DECK(cardCollection);
  quack.RELEASE_CARD('HERO'); // hero card are top on initial deck
  quack.SHUFFLE_DECK();
  await delay(300)
  quack.RELEASE_CARD('L1');
  await delay(300)
  quack.RELEASE_CARD('L2');
  await delay(300)
  quack.RELEASE_CARD('L3');
  await delay(300)
  quack.RELEASE_CARD('L4');
};

export const Target = ({ id }) => (
  <section data-zone={id} className="w-[200px] h-[300px] rounded-2xl border border-4 p-4 border-zinc-700 border-dashed">
  </section>
)

/** 
 * @param {Object} props
 * @param {import('./alienDuck').Card} props.card
 * @param {import('./alienDuck').Quack} props.quack
 * @param {import('./alienDuck').SlotId} props.slotId
 * @returns {JSX.Element}
 */
export const Card = ({card, quack, slotId}) => {
  const { power, name, type, maxPower, side, id, src } = card;
  const [isDrag, setDrag] = useState(false);
  return (
  <section 
    data-zone={id} 
    className={`
      w-[200px]
      h-[300px]
      ${isDrag && false ? "z-10 w-[300px] h-[200px]" : ""}
      ${isDrag && "invisible" ? "" : ""}
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
      --hover:bg-contain
      bg-bottom
      bg-cover
      bg-no-repeat

      hover:text-orange-300
    `}
    draggable
    onDragStart={() => {
      setDrag(true);
      // console.log(`start: ${id}`);
      quack.DRAG_START({actor:card, from:slotId})
    }}
    onDragEnd={() => {
      quack.PLAY_CARD({actor:card, slotId})
      setDrag(false)
    }}
  >
    <p className="pointer-events-none">{power}{type == "HERO" ? ` \\ ${maxPower}` : ''}</p>
    <p className="pointer-events-none max-w-[180px] text-wrap">{name}</p>
    <p className="pointer-events-none">{side}</p>
  </section>
);}

/**
 * Renders a Slot component that can accept a card and handle drag-and-drop functionality.
 * 
 * @param {Object} props
 * @param {Partial<import('./alienDuck').TableSpot>} props.slot 
 * @param {import('./alienDuck').Quack} props.quack
 * @returns {JSX.Element}
 */
export const Slot = ({ slot:{card, id}, quack }) => {
  const [isOver, setOver] = useState(false);
  return (
    <pre className={`text-white ${isOver ? "opacity-50" : ""}`}
    // onDragEnter={p => console.dir(p.target?.attributes?.['data-zone']?.nodeValue)}
    onDragEnter={() => {console.dir(id); setOver(true)}}
    onDragLeave={() => {setOver(false)}}
    onDragOver={(e) => {e.preventDefault()}}
    onDrop={(e) => {
      e.preventDefault();
      e.stopPropagation();
      quack.DRAG_END(id);
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
    initialSaga(quack);
  }, [quack]);

  return (
    <main className="bg-black text-zinc-200 --bg-[url('ufo-theory.png')]">
      <article className="relative p-4">
        <pre className="pointer-events-none select-none">{`
          A L I E N - S O L I T A R E
          powered by: jsdoc-duck        future:${state.deck.length} past: 0
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

        <pre className="pointer-events-none select-none">
          <p className="text-green-700 py-4">At this point content is a mass of chaos</p>
          {JSON.stringify(state.fly, null, 2)}
        </pre>

        <img src={'ufo-theory.png'} />
      </article>
    </main>
  );

}