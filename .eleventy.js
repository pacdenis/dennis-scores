module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("pad3", (n) => String(n).padStart(3, "0"));

  // static assets
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  // Decap CMS admin panel lives at /admin on the published site
  eleventyConfig.addPassthroughCopy({ admin: "admin" });

  // collections, sorted by the "order" field set in each item
  eleventyConfig.addCollection("secularWorks", (api) =>
    api.getFilteredByGlob("src/secular-works/*.md").sort((a, b) => a.data.order - b.data.order)
  );
  eleventyConfig.addCollection("sacredWorks", (api) =>
    api.getFilteredByGlob("src/sacred-works/*.md").sort((a, b) => a.data.order - b.data.order)
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
