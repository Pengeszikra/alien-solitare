import { useState } from "react";
import { Card } from "./AlienSolitare";
import { cardCollection } from "./cardCollections";

/** @type {(props: { deck: import('./alienDuck').Card[] }) => JSX.Element} */
export const GalleryDecider = ({ deck }) => {
  const [favorite, pick] = useState({});
  const [change, storeSrc] = useState({ src: null, owner: null });
  return (
    <section className="grid gap-4 grid-cols-1 place-items-start -hidden">
      <h1 className="p-4">G A L L E R Y</h1>
      <pre>{JSON.stringify(deck.slice(0, cardCollection.length),null,2)}</pre>

      <section className="grid gap-4 grid-cols-4 ">
        {deck.map((card, index) =>
          <div
            key={card.src}
            // onClick={() => pick(fav => ({...fav, [card.src]:!fav[card.src] })  )} 
            onClick={() => {
              if (!change.src) {
                storeSrc({
                  owner: card,
                  src: card.src,
                })
              } else {
                const save = card.src;
                card.src = change.src;
                change.owner.src = save;
                storeSrc({src: null, owner: null})
              }
            }}
            className={`p-2 rounded-xl ${favorite[card.src] ? "bg-stone-700" : ""}`}
          >
            <p className="p-2">{card.src} - {index}</p>
            <div className="select-none pointer-events-none">
              <Card key={card.src} card={card} />

            </div>
          </div>
        )}
        <pre>{JSON.stringify(Object.entries(favorite).filter(([a, b]) => b).map(([u, v]) => u), null, 2)}</pre>
      </section>
    </section>
  );
}