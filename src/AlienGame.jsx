import { cardCollection } from "./cardCollections";
import { useDuck } from "jsdoc-duck";
import { label, reducer, setup } from "./alienDuck";
import { useEffect } from "react";

export const Target = () => (
  <section className="w-[200px] h-[300px] rounded-2xl border border-4 p-4 border-zinc-700 border-dashed">
  </section>
)

/** @param {import('./alienDuck').Card} */
export const Card = ({ power, name, type, maxPower }) => (
  <section className="w-[200px] h-[300px] rounded-2xl border border-4 p-4 border-zinc-700 text-2xl bg-zinc-900 text-zinc-300" draggable>
    <p className="pointer-events-none">{power}{type == "HERO" ? ` \\ ${maxPower}` : ''}</p>
    <p className="pointer-events-none">{name}</p>
  </section>
);

export const AlienGame = () => {
  const [state, quack] = useDuck(reducer, setup, label);

  useEffect(() => {
    const [hero , ...deck] = cardCollection;
    quack.PLAY_CARD(hero, "HERO");
    quack.CREATE_DECK(deck);
    quack.SHUFFLE_DECK();
  }, [quack]);

  return (
    <main className="bg-black text-zinc-200 --bg-[url('ufo-theory.png')]">
    <article className="relative p-4">
      <section className="grid gap-4 --absolute top-4 left-4 grid-cols-1 place-items-start">
          <section className="grid gap-4 grid-cols-4">
            <Card {...cardCollection[34]} />
            <Card {...cardCollection[8]} />
            <Target />
            <Card {...cardCollection[12]} />
          </section>
          <section className="grid gap-4 grid-cols-4">
            <Card {...cardCollection[0]} />
            <Target />
            <Card {...cardCollection[21]} />
            <Card {...cardCollection[18]} />
          </section>
        </section>


      <pre className="pointer-events-none select-none">{`
          A L I E N - S O L I T A R E
                  powered by: jsdoc-duck
      `}
      {JSON.stringify(state, null, 2)}
      </pre>
    </article>
    </main>
  );

}
