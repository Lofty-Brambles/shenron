# Structure

#### Commands

- [x] prefix, reload, ping [bot admin stuff]
- [x] help [obvious, what it does]
- [x] admin add/remove [cos beerus asked]

- [x] forage [no tools / sickle, low coins]
- [x] chop [hatchet, moderate coins]
- [x] mine [pickaxe, moderate coins]
- [x] daily [increments as collected, breaks after 3 weeks]

- [ ] fight [random minigame to fight, higher level means higher rewards and occasional bosses]
- [ ] shop, buy, give [item / coin] [for an economy system]
- [x] inventory [showcases all the items]
- [ ] craft [shows items and crafts them, having in inventory gives perks]
- [x] sell [sell excess materials at fixed rate]

- [ ] profile [shows level, info, about user, all thelevel rewards as well]

**Don't forget the re-save cron-job and also execute it on bot end**

#### Buttons

- [ ] admin shop [opens up a ticket, from a modal on what to buy]
- [ ] forum channel for in game trading

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
