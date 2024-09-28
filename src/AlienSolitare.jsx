/**
 * @typedef {{
 * type: 'spaceship' | 'gadget' | 'alien' | 'treasure' | 'location' | 'action' | 'hero',
 * store: number,
 * action: number,
 * name: string,
 * id: string,
 * mode: 'defensive' | 'offensive' | 'healer' | ''
 * skill?: string,
 * solution: number,
 * problem: number,
 * }} CardType
 */


/** @type {CardType[]} */
const Deck = [
  {
    type: 'hero',
    name: 'player',
    store: 1,
    action: 2,
    id: '001',
    mode: 'defensive',
    solution: 12,
    problem: 0,
  },
  {
    type: 'alien',
    name: 'Hyxwill',
    store: 0,
    action: 0,
    id: '9230320',
    mode: 'offensive',
    solution: 5,
    problem: 0,
  },
  {
    type: 'location',
    name: 'Othor Swamp',
    store: 1,
    action: 0,
    id: '322332',
    mode: 'defensive',
    solution: 0,
    problem: 6,
  },
]

export const irr = () => Math.random() * pictures.length | 0; 


export const Card = ({type, name, store, action, id, solution, problem, mode, iidx}) => (
  <div className="rounded-2xl border border-zinc-800 w-[200px] h-[250px] p-2" draggable> 
    {/* <img src={pictures[iidx]} className='pointer-events-none'/> */}
    {/* <p>type: {type}</p>
    <p>name: {name}</p>
    <p>store: {store}</p>
    <p>action: {action}</p>
    <p>id: {id}</p>
    <p>mode: {mode}</p>
    <p>solution: {solution}</p>
    <p>problem: {problem}</p> */}
  </div>
)


export const AlienSolitare = () => {
  return (
    <section className="grid gap-2 grid-cols-5">
      <Card {...Deck[0]} iidx={irr()} />
      <Card {...Deck[1]} iidx={irr()} />
      <Card {...Deck[2]} iidx={irr()} />
      <Card iidx={irr()}/>
      <Card iidx={irr()}/>
      <Card iidx={irr()} />
      <Card iidx={irr()} />
      <Card iidx={irr()} />
      <Card iidx={irr()} />
      <Card iidx={irr()} />
    </section>
  )
}