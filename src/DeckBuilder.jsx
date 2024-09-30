import { descend } from "./utils";
import { Card } from "./AlienSolitare";

/** @type {(props: { deck: import('./alienDuck').Card[] }) => JSX.Element} */
export const DeckBuilder = ({deck}) => (
  <section className="grid gap-4 grid-cols-1 place-items-start -hidden">
    <h1 className="p-4">D E C K</h1>
    <pre>{JSON.stringify({
      hostile: deck.filter(card => card.side === "DARK" && card.work === "HIT").map(card => card.power).sort(descend).join(),
      fighter: deck.filter(card => card.side === "LIGHT" && card.work === "HIT").map(card => card.power).sort(descend).join(),
      survivor: deck.filter(card => card.side === "LIGHT" && card.work === "PROTECT").map(card => card.power).sort(descend).join(),
      medicine: deck.filter(card => card.side === "LIGHT" && card.work === "FIX").map(card => card.power).sort(descend).join(),
      assets: deck.filter(card => ["NEUTRAL", "LIGHT"].includes(card.side) && card.work === "WORTH").map(card => card.power).sort(descend).join(),
      skill: deck.filter(card => card.side === "LIGHT" && card.work === "SKILL").map(card => card.name).join(),
      debug: deck.filter(card => !["DARK", "NEUTRAL", "LIGHT"].includes(card.side)).map(card => card.id).join(),
    }, null, 2)}</pre>
    <section className="grid gap-4 grid-cols-4 ">
      {deck.map((card) => 
        <div key={card.id}>
          <Card key={card.id} card={card} />
        </div>
      )}
    </section>
  </section>
);