module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("pad3", (n) => String(n).padStart(3, "0"));

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
