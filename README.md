# Structure

#### Commands

[x] prefix, reload, ping [bot admin stuff]
[x] help [obvious, what it does]
[ ] admin add/remove [cos beerus asked]

[x] forage [no tools / sickle, low coins]
[ ] chop [hatchet, moderate coins]
[ ] mine [pickaxe, moderate coins]
[ ] daily [increments as collected, breaks after 3 weeks]

[ ] fight [random minigame to fight, higher level means higher rewards and occasional bosses]
[ ] shop, buy, give [item / coin] [for an economy system]
[ ] inventory [showcases all the items]
[ ] craft [shows items and crafts them, having in inventory gives perks]
[ ] sell [sell excess materials at fixed rate]

[ ] profile [shows level, info, about user, all thelevel rewards as well]

#### Buttons

[ ] admin shop [opens up a ticket, from a modal on what to buy]
[ ] forum channel for in game trading

#### Stats

```ts
export const INITIAL_STATS = {
  inventory: {} as Record<string, number>,
  hitpoints: 100,
  damage: 5,
  coins: 0,
  level: 1,
  exp: 0,
};
```
