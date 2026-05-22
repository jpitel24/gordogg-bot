const FEED_URL = "https://letterboxd.com/gordogg24p/rss/";

function extractTitle(rawTitle) {
  // Letterboxd titles are formatted as "Film Title, by Director Name"
  const match = rawTitle.match(/^(.+?),\s*by\s+.+$/);
  return match ? match[1].trim() : rawTitle.trim();
}

function extractRating(description) {
  const match = description.match(/[★½]+/);
  return match ? match[0] : null;
}

export default async function handler(req, res) {
  const response = await fetch(FEED_URL);
  const xml = await response.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3);

  const entries = items.map((item) => {
    const rawTitle = item[1].match(/<title><!\[CDATA\[(.+?)\]\]><\/title>/) ||
      item[1].match(/<title>(.+?)<\/title>/);
    const descBlock = item[1].match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
      item[1].match(/<description>([\s\S]*?)<\/description>/);

    const title = rawTitle ? extractTitle(rawTitle[1]) : "Unknown";
    const rating = descBlock ? extractRating(descBlock[1]) : null;

    return rating ? `${title} ${rating}` : title;
  });

  const last = entries.pop();
  const text =
    `gordogg's recent watches on Letterboxd: ${entries.join(", ")}, and ${last}. ` +
    `Give him a follow: letterboxd.com/gordogg24p`;

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(text);
}
