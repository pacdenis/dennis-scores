const VR_LETTER_IDX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

function vrAbsStep(letter, octave) {
  return octave * 7 + VR_LETTER_IDX[letter];
}

function vrParseNote(str) {
  const m = /^([A-Ga-g])(\d)$/.exec((str || "").trim());
  if (!m) return null;
  return { letter: m[1].toUpperCase(), octave: parseInt(m[2], 10) };
}

function vrNoteY(letter, octave, base = 80) {
  return base - (vrAbsStep(letter, octave) - vrAbsStep("E", 4)) * 5;
}

function vrLedgerLines(y, base = 80, top = 40) {
  const lines = [];
  if (y > base) {
    const n = Math.floor((y - base) / 10);
    for (let k = 1; k <= n; k++) lines.push(base + 10 * k);
  } else if (y < top) {
    const n = Math.floor((top - y) / 10);
    for (let k = 1; k <= n; k++) lines.push(top - 10 * k);
  }
  return lines;
}

function voiceRangeSVG(lowStr, highStr) {
  const low = vrParseNote(lowStr);
  const high = vrParseNote(highStr);
  if (!low || !high) return "";

  const lowY = vrNoteY(low.letter, low.octave);
  const highY = vrNoteY(high.letter, high.octave);
  const shift = 30;
  const noteX = 90;

  let svg = `<svg class="voice-range" width="310" height="170" viewBox="0 0 310 170" role="img" aria-label="Диапазон голоса: от ${lowStr} до ${highStr}">`;

  [40, 50, 60, 70, 80].forEach((ly) => {
    svg += `<line x1="55" y1="${ly + shift}" x2="255" y2="${ly + shift}" class="vr-line"/>`;
  });

  svg += `<text x="30" y="${80 + shift}" class="vr-clef">&#119070;</text>`;

  [...vrLedgerLines(lowY), ...vrLedgerLines(highY)].forEach((ly) => {
    svg += `<line x1="${noteX - 15}" y1="${ly + shift}" x2="${noteX + 15}" y2="${ly + shift}" class="vr-ledger"/>`;
  });

  svg += `<line x1="${noteX}" y1="${lowY + shift}" x2="${noteX}" y2="${highY + shift}" class="vr-stem"/>`;

  [lowY, highY].forEach((ny) => {
    svg += `<ellipse cx="${noteX}" cy="${ny + shift}" rx="7.5" ry="5.5" class="vr-note"/>`;
  });

  svg += `<text x="${noteX}" y="${lowY + shift + 22}" class="vr-label" text-anchor="middle">${lowStr}</text>`;
  svg += `<text x="${noteX}" y="${highY + shift - 12}" class="vr-label" text-anchor="middle">${highStr}</text>`;
  svg += `<text x="${noteX + 45}" y="${(lowY + highY) / 2 + shift + 5}" class="vr-range" text-anchor="start">${lowStr}&#8211;${highStr}</text>`;

  return svg + `</svg>`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("pad3", (n) => String(n).padStart(3, "0"));
  eleventyConfig.addShortcode("voiceRangeSVG", voiceRangeSVG);

  // static assets
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  // files uploaded through the CMS media library (audio, PDF previews)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // Decap CMS admin panel lives at /admin on the published site
  eleventyConfig.addPassthroughCopy({ admin: "admin" });

  // collections, sorted by real creation/publication date (oldest first)
  eleventyConfig.addCollection("secularWorks", (api) =>
    api.getFilteredByGlob("src/secular-works/*.md").sort((a, b) => new Date(a.data.date_created) - new Date(b.data.date_created))
  );
  eleventyConfig.addCollection("sacredWorks", (api) =>
    api.getFilteredByGlob("src/sacred-works/*.md").sort((a, b) => new Date(a.data.date_created) - new Date(b.data.date_created))
  );
  eleventyConfig.addCollection("journal", (api) =>
    api.getFilteredByGlob("src/journal/*.md").sort((a, b) => (a.data.date_sort < b.data.date_sort ? 1 : -1))
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
