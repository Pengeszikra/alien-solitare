import { useState } from "react";
import { Card } from "./AlienSolitare";

/** @type {(props: { deck: import('./alienDuck').Card[] }) => JSX.Element} */
export const GalleryDecider = ({ deck }) => {
  const [favorite, pick] = useState({});
  return (
    <section className="grid gap-4 grid-cols-1 place-items-start -hidden">
      <h1 className="p-4">G A L L E R Y</h1>
      
      <section className="grid gap-4 grid-cols-4 ">
        {deck.map((card) =>
          <div 
            key={card.src} 
            onClick={() => pick(fav => ({...fav, [card.src]:!fav[card.src] })  )} 
            className={`p-2 rounded-xl ${favorite[card.src] ? "bg-stone-700" : ""}`}
          >
            <p className="p-2">{card.src}</p>
            <div className="select-none pointer-events-none">
            <Card key={card.src} card={card} />

            </div>
          </div>
        )}
      <pre>{JSON.stringify(Object.entries(favorite).filter(([a,b])=>b).map(([u,v])=>u), null, 2)}</pre>  
      </section>
    </section>
  );
}