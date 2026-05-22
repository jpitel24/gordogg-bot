const FEED_URL = "https://letterboxd.com/gordogg24p/rss/";

// Letterboxd title format: "Film Title, Year - ★★★½"
function extractTitle(rawTitle) {
  const match = rawTitle.match(/^(.+?),\s*\d{4}/);
  return match ? match[1].trim() : rawTitle.trim();
}

// Rating lives in the title field after " - "
function extractRating(rawTitle) {
  const match = rawTitle.match(/-\s*([★½]+)/);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  const response = await fetch(FEED_URL);
  const xml = await response.text();

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3);

  const entries = items.map((item) => {
    const rawTitleMatch =
      item[1].match(/<title><!\[CDATA\[(.+?)\]\]><\/title>/) ||
      item[1].match(/<title>(.+?)<\/title>/);

    const rawTitle = rawTitleMatch ? rawTitleMatch[1] : "Unknown";
    const title = extractTitle(rawTitle);
    const rating = extractRating(rawTitle);

    return rating ? `${title} ${rating}` : title;
  });

  const last = entries.pop();
  const text =
    `gordogg's recent watches on Letterboxd: ${entries.join(", ")}, and ${last}. ` +
    `Give him a follow: letterboxd.com/gordogg24p`;

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(text);
}
