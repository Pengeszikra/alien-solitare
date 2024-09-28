import { useEffect, useState } from "react";
import { useDuck } from "jsdoc-duck";
import { label, reducer, setup } from "./alienDuck";
import { cardCollection } from "./cardCollections";
import { images } from "./list";

/** @type {(ms:number) => Promise<void>} */
export const delay = (ms) => new Promise((release) => setTimeout(release, ms));

/** @type {(quack:import("jsdoc-duck").Quack<import('./alienDuck').Quack>) => void} */
const initialSaga = async (quack) => {
  const [hero, ...deck] = cardCollection;
  await delay(200)
  quack.PLAY_CARD({ actor: hero, slotId: 'HERO' });
  quack.CREATE_DECK(deck);
  quack.SHUFFLE_DECK();
  await delay(300)
  quack.RELEASE_CARD('L1');
  await delay(300)
  quack.RELEASE_CARD('L2');
  await delay(300)
  quack.RELEASE_CARD('L3');
  await delay(300)
  quack.RELEASE_CARD('L4');
  await delay(300)
  quack.RELEASE_CARD('A2');
};

export const Target = ({ id }) => (
  <section data-zone={id} className="w-[200px] h-[300px] rounded-2xl border border-4 p-4 border-zinc-700 border-dashed">
  </section>
)

/** @param {import('./alienDuck').Card} */
export const Card = ({ power, name, type, maxPower, side, id }) => {
  const [isDrag, setDrag] = useState(false);
  return (
  <section 
    data-zone={id} 
    className={`
      w-[200px]
      h-[300px]
      rounded-2xl
      border
      border-4
      p-4
      border-zinc-700
      text-xl
      bg-zinc-900 
      text-zinc-300
      ${isDrag ? "border-dashed" : ""}
      bg-[url('${images[Number(id.split('').slice(1).join(''))]}')]
      bg-contain
      bg-bottom
      hover:bg-cover
      hover:bg-center
      bg-no-repeat
      hover:text-orange-300
    `}
    draggable
    onDragStart={(e) => {
      setDrag(true);
      console.log(`start: ${id}`)
    }}
    onDragEnd={() => setDrag(false)}
  >
    <p className="pointer-events-none">{power}{type == "HERO" ? ` \\ ${maxPower}` : ''}</p>
    <p className="pointer-events-none max-w-[180px] text-wrap">{name}</p>
    <p className="pointer-events-none">{side}</p>
  </section>
);}

/** @param {Partial<import('./alienDuck').TableSpot>} */
export const Slot = ({ card, id }) => {
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
      console.log(`end: ${id}`)
    }}
    >
      {card
        ? <Card {...card} />
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
            <Slot {...state.table.L1} />
            <Slot {...state.table.L2} />
            <Slot {...state.table.L3} />
            <Slot {...state.table.L4} />
          </section>
          <section className="grid gap-4 grid-cols-4">
            <Slot {...state.table.HERO} />
            <Slot {...state.table.A1} />
            <Slot {...state.table.A2} />
            <Slot {...state.table.S1} />
          </section>
        </section>

        <pre className="pointer-events-none select-none">
          <p className="text-green-700 py-4">Let do some real coding work like a hacker.</p>
          {JSON.stringify(state.table, null, 2)}
        </pre>
      </article>
    </main>
  );

}
