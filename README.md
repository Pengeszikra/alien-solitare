_This is a submission for the [Web Game Challenge](https://dev.to/challenges/webgame), Build a Game: Alien Edition_

## What I Built
A L I E N - S O L I T A R E 
_powered by jsdoc-duck_

**Technical Achievement:** I created a small jsDoc source React state handling npm module called: [jsdoc-duck](https://www.npmjs.com/package/jsdoc-duck) but until now I don't write any example application for it, I think this Challange is a right time for do it, and proof my module concept are working. Also proof the jsDoc working fine, and usable to typesafe JS coding without TypeScript.

**Plagiarism:** Saddly my time is very limited, so a first moment I write down the base concept to my phone meanwhile of passenger of country drive ( 2hr ) in temux and vim. My plane was 2 or 3 day development time is need to be enough, but I am not the fastes developer. That why I choose this game method which is very lovely, mid complex, used by: [Card Crawl - base idea](https://play.google.com/store/apps/details?id=com.tinytouchtales.cardcrawl&hl=en_US), reworked that game mechanism to Alien theme.

**Art:** A previous year I spended to create many (60K+) AI generated images with (dream.ai, clipDrop, ChatGPT) , so I have enough Sci-Fi related which is handy for this game.

## Something above us!

> Aliens or worst. For solving our mankind agression we are decide: stop the war on Earth, and let's go outside and conquerer as many planet as possible - we hope to find at least one. Each political group and great company agree to start exploring a different direction!

`"We ended the war on Earth by starting a war in the stars."`

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3it31rbqn329b4m6ufk9.png)

## Key Code:
_duck working according this developer declared type contain all actions with their types_
```js
/**
 * @typedef { |
 * { type: "CREATE_DECK", payload: Card[] } |
 * { type: "SHUFFLE_DECK" } |
 * { type: "RELEASE_CARD", payload: SlotId } |
 * { type: "DRAG_START", payload: {from:SlotId, card:Card} } |
 * { type: "MOVE_CARD", payload: Card } |
 * { type: "DRAG_END", payload: SlotId } |
 * { type: "PLAY_CARD", payload: {actor:Card, slotId:SlotId } } |
 * { type: "GO_ON", payload: Phases } |
 * { type: "WHAT_IS_NEXT" }

 * } Actions
 */
```

## Demo
<!-- You can directly embed your game and code into this post (see the FAQ section of the challenge page) or you can share links to your game and public repo. -->

{% embed https://alien-solitare.vercel.app/ %}

{% embed https://github.com/Pengeszikra/alien-solitare %}

{% embed https://www.npmjs.com/package/jsdoc-duck?activeTab=readme %}

## Journey
<!-- Tell us about your process, what you learned, anything you are particularly proud of, what you hope to do next, etc. -->

Under heavy development:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1lj8mzd2wsjymr72w125.png)

... when the drag and drop are start working 


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zn35m3zk4vkvib0zwrua.png)

... deck building according [Crawl Card Deck List](https://steamcommunity.com/sharedfiles/filedetails/?id=1296228670) _plagium_

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4zcu8fhsylk3wajy0gpa.png)

I was rethink, this is a perfect example of interactive TDD development in process, because on editor I was modify the `cardCollections.js` and on the screen I continous show the result, which is collected this query on proper format, on game page.
```jsx
<pre>{JSON.stringify({
  hostile: state.deck.filter(card => card.side === "DARK" && card.work === "HIT").map(card => card.power).sort(descend).join(),
  fighter: state.deck.filter(card => card.side === "LIGHT" && card.work === "HIT").map(card => card.power).sort(descend).join(),
  survivor: state.deck.filter(card => card.side === "LIGHT" && card.work === "PROTECT").map(card => card.power).sort(descend).join(),
  medicine: state.deck.filter(card => card.side === "LIGHT" && card.work === "RAISE").map(card => card.power).sort(descend).join(),
  assets: state.deck.filter(card => card.side === "LIGHT" && card.work === "WORTH").map(card => card.power).sort(descend).join(),
  skill: state.deck.filter(card => card.side === "LIGHT" && card.work === "SKILL").map(card => card.name).join(),
  debug: state.deck.filter(card => card.side !== "LIGHT" && card.side !== "DARK").map(card => card.id).join(),
  }, null, 2)}</pre>
```
> final rush aganst the time: just 9h left, and need to be finalize the game rule, replace a random images with a selected set, publish to somwhere the running code. This is still a POC, that why I choose jump into a middle of development, and the game core part will realise.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5khro7cc3ubj5volevaz.png)

<!-- We encourage you to consider adding a license for your code. -->
> *License:* Open Source 

<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->

<!-- Don't forget to add a cover image (if you want). -->

<!-- Thanks for participating!  -->

```
[    ][    ][     ][         ] <- 4 possible card draw from deck
[item][hero][alien][spaceship] <- hero have solution points 
```

## Burn Out vs. Survive
Our Captain (represent you in the game) have a bunch of solution to facing with incoming problems. But you can also manage allys and collect the assets. Two possible outcome will happen: Captain run out of solution and that  is lead to Burn Out. But if no more problems, then Captain Survive and happy after all. Until the next mission...

## Code size by Tokei
> Comments is the jsDoc type system.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s2cb9qytrojincd5h3iy.png)

## Yellow are indicated TYPE in code
>thx to *jsDoc*

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dw1t7a9j4nfefbpyvk4a.png) 

## Live Without CSS file

Instead CSS I using **Tailwind**, but for simplify it is directly linked to html as cdn:
```html
<script src="https://cdn.tailwindcss.com"></script>
```
> *Drawback:* Not for product ready warning:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rnii6m9lnucvxne6tx3b.png)
_Previous image devtool log also show we can live without redux devtool, because we saw the ongoing react actions like in Redux just much lighter weight. Do not burn the woods!:_
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oq22i2gu1u9o72sv76qo.png)

## React Devtool
> Proof to our game component structure keep as simple as possible.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/571k1ji12ot1s4rnaqtf.png)

## Conclusion
So this game are very early POC state at right moment, but it is `open source` (jsdoc-duck also), so any one who is feel energy to improving this one will be a full functional game. This is a short feature list which is need to be develop:
- some begining of game
- card release animation
- drop the Ally
- skill cards
- collect a new skill, captain card
- more dangerous mission
- UI graph
- Redesign card border
- high score
- L5, L6, A3, S2 :: Space-ship / Location dynamic table size feature
- responsive design
- ... lot of in my head, but need to be finishing the code MVP version.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l1ojlmem4bwsx9e51ywb.png)

Happy Coding! Remember: _Something Above Us!_ quack . quack .. quack ....