const roles = [
  "1976 NBA scoring champ Bob McAdoo",
  "Hammy from Over the Hedge",
  "a detective two weeks from retirement",
  "Geoffrey the Giraffe from Toys R Us",
  "an uncharged Roomba",
  "a PSA 9 1st edition Charizard",
  "a rusted-out 2000 Ford Crown Victoria",
  "an overproofed sourdough loaf",
  "my dad still out buying milk and cigarettes",
  "a pee wee hockey coach",
  "a lukewarm cup of coffee",
  "a sexy serial killer",
  "a gold wyvern with Tourette's",
];

export default function handler(req, res) {
  const role = roles[Math.floor(Math.random() * roles.length)];
  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(role);
}
