export const HowToPlay = () => {
  return (
    <article className="bg-zinc-900 text-zinc-300 p-6 rounded-xl shadow-lg text-sm">
      <section className="mb-4">
        <h1 className="text-2xl font-bold text-zinc-600">How to Play Alien Solitaire</h1>
        <p className="text-zinc-400"><i>(... answer the AI ...)</i></p>
      </section>

      <img src="rFy0pWea.jpg" className="w-1/2" />


      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Objective</h2>
        <p>Your goal is to manage your hero and team to conquer the challenges on the board, solve problems, and ensure the survival of your crew while collecting points.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Game Setup</h2>
        <ul className="list-disc ml-6">
          <li><strong>Hero Card:</strong> Represents your leader, located in the HERO slot.</li>
          <li><strong>Ally Cards:</strong> Crew members with specific abilities.</li>
          <li><strong>Strange Cards:</strong> Enemies or challenges you must defeat.</li>
          <li><strong>Table Layout:</strong> The board includes LINE slots (L1, L2, L3, L4), ACTIVE slots (A1, A2), STORE slot (S1), DROP slot, and HERO slot.</li>
        </ul>
      </section>

      <img src="public/gKTvxGHc.jpg" className="w-1/2" />

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Phases</h2>
        <ul className="list-disc ml-6">
          <li><strong>BEGIN:</strong> The start of the game.</li>
          <li><strong>STORY_GOES_ON:</strong> Enemies appear, and a new round begins.</li>
          <li><strong>SOLITAIRE:</strong> Actively manage cards and face challenges.</li>
          <li><strong>BURN_OUT:</strong> Hero is defeated (Game Over).</li>
          <li><strong>SURVIVE:</strong> You’ve won the game by handling all challenges.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Gameplay</h2>
        <ol className="list-decimal ml-6">
          <li><strong>Release Cards:</strong> Cards from the deck are dealt into available slots.</li>
          <li><strong>Move Cards:</strong> Drag cards between slots to activate abilities.</li>
          <li><strong>Play Cards:</strong> Solve problems or defeat enemies by matching work types and power levels.</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <ul className="list-disc ml-6">
          <li><strong>ENGAGE:</strong> Attack or engage enemies.</li>
          <li><strong>GUARD:</strong> Defend your hero.</li>
          <li><strong>FIX:</strong> Heal or repair cards.</li>
          <li><strong>SKILL:</strong> Use special card abilities.</li>
          <li><strong>WORTH:</strong> Gain points when activated.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">End of Round & Scoring</h2>
        <p>
          At the end of each round, the game checks if your hero survives, challenges are solved, and cards remain in the deck. Your score increases based on successful actions, such as defeating enemies or solving problems.
        </p>
      </section>

      <img src="public/5Sym4igk.jpg" className="w-1/2" />

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Special Conditions</h2>
        <ul className="list-disc ml-6">
          <li><strong>BURN_OUT:</strong> The game ends if your hero is defeated.</li>
          <li><strong>SURVIVE:</strong> You win if all challenges are completed.</li>
        </ul>
      </section>

      <section>
        <p className="text-sm text-zinc-400">Think strategically, move wisely, and make sure your hero survives the alien onslaught!</p>
      </section>
    </article>
  );
};
