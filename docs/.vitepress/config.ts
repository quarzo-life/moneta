import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

const denoJsonc = readFileSync(
  fileURLToPath(new URL("../../deno.jsonc", import.meta.url)),
  "utf-8",
);
const version = denoJsonc.match(/"version":\s*"([^"]+)"/)![1];

export default defineConfig({
  title: "Moneta",
  description: "Safe monetary calculations in TypeScript, backed by bigint.",
  lang: "en",
  cleanUrls: true,
  // GitHub Pages serves project sites from https://<org>.github.io/<repo>/.
  // Switch to "/" if you move to a custom domain (via a docs/public/CNAME file).
  base: "/moneta/",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Moneta" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Safe monetary calculations in TypeScript, backed by bigint.",
      },
    ],
  ],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Docs", link: "/getting-started/quick-start" },
      { text: "API", link: "/api/money" },
      {
        text: `v${version}`,
        items: [
          {
            text: "Changelog",
            link: "https://github.com/quarzo-life/moneta/releases",
          },
          {
            text: "JSR package",
            link: "https://jsr.io/@quarzo-life/moneta",
          },
        ],
      },
    ],
    sidebar: {
      "/": [
        {
          text: "Getting Started",
          items: [
            { text: "Quick start", link: "/getting-started/quick-start" },
            { text: "Compatibility", link: "/getting-started/compatibility" },
          ],
        },
        {
          text: "Core Concepts",
          items: [
            { text: "Money", link: "/core-concepts/money" },
            { text: "Currency", link: "/core-concepts/currency" },
            { text: "Scale", link: "/core-concepts/scale" },
            { text: "Mutations", link: "/core-concepts/mutations" },
            { text: "Comparisons", link: "/core-concepts/comparisons" },
            { text: "Formatting", link: "/core-concepts/formatting" },
          ],
        },
        {
          text: "Guides",
          items: [
            {
              text: "Danger-prefixed operations",
              link: "/guides/danger-operations",
            },
            {
              text: "Allocating without losing pennies",
              link: "/guides/allocating-money",
            },
            {
              text: "Non-decimal currencies",
              link: "/guides/non-decimal-currencies",
            },
            {
              text: "Serialization with bigint",
              link: "/guides/serialization",
            },
            {
              text: "Adding a new currency",
              link: "/guides/adding-a-currency",
            },
            {
              text: "Cryptocurrency support",
              link: "/guides/cryptocurrencies",
            },
          ],
        },
        {
          text: "API Reference",
          collapsed: false,
          items: [
            { text: "money", link: "/api/money" },
            { text: "Currencies", link: "/api/currencies" },
            {
              text: "Mutations",
              collapsed: true,
              items: [
                { text: "add", link: "/api/mutations/add" },
                { text: "subtract", link: "/api/mutations/subtract" },
                { text: "multiply", link: "/api/mutations/multiply" },
                { text: "allocate", link: "/api/mutations/allocate" },
                {
                  text: "dangerDivide",
                  link: "/api/mutations/danger-divide",
                },
              ],
            },
            {
              text: "Conversions",
              collapsed: true,
              items: [
                { text: "convert", link: "/api/conversions/convert" },
                {
                  text: "normalizeScale",
                  link: "/api/conversions/normalize-scale",
                },
                {
                  text: "transformScale",
                  link: "/api/conversions/transform-scale",
                },
                { text: "trimScale", link: "/api/conversions/trim-scale" },
                { text: "parse", link: "/api/conversions/parse" },
                {
                  text: "dangerRound",
                  link: "/api/conversions/danger-round",
                },
              ],
            },
            {
              text: "Comparisons",
              collapsed: true,
              items: [
                { text: "equal", link: "/api/comparisons/equal" },
                { text: "greaterThan", link: "/api/comparisons/greater-than" },
                {
                  text: "greaterThanOrEqual",
                  link: "/api/comparisons/greater-than-or-equal",
                },
                { text: "lessThan", link: "/api/comparisons/less-than" },
                {
                  text: "lessThanOrEqual",
                  link: "/api/comparisons/less-than-or-equal",
                },
                { text: "maximum", link: "/api/comparisons/maximum" },
                { text: "minimum", link: "/api/comparisons/minimum" },
                {
                  text: "haveSameAmount",
                  link: "/api/comparisons/have-same-amount",
                },
                {
                  text: "haveSameCurrency",
                  link: "/api/comparisons/have-same-currency",
                },
                {
                  text: "hasSubUnits",
                  link: "/api/comparisons/has-sub-units",
                },
              ],
            },
            {
              text: "Formatting",
              collapsed: true,
              items: [
                { text: "toDecimal", link: "/api/formatting/to-decimal" },
                { text: "toSnapshot", link: "/api/formatting/to-snapshot" },
                { text: "toUnits", link: "/api/formatting/to-units" },
              ],
            },
            {
              text: "Rounding",
              collapsed: true,
              items: [
                { text: "down", link: "/api/rounding/down" },
                { text: "up", link: "/api/rounding/up" },
                { text: "halfUp", link: "/api/rounding/half-up" },
                { text: "halfDown", link: "/api/rounding/half-down" },
                { text: "halfEven", link: "/api/rounding/half-even" },
                { text: "halfOdd", link: "/api/rounding/half-odd" },
                {
                  text: "halfTowardsZero",
                  link: "/api/rounding/half-towards-zero",
                },
                {
                  text: "halfAwayFromZero",
                  link: "/api/rounding/half-away-from-zero",
                },
              ],
            },
            {
              text: "Helpers",
              collapsed: true,
              items: [
                { text: "assert", link: "/api/helpers/assert" },
                { text: "max", link: "/api/helpers/max" },
                { text: "min", link: "/api/helpers/min" },
                { text: "JSON bigint", link: "/api/helpers/json-bigint" },
              ],
            },
          ],
        },
        {
          text: "FAQ",
          items: [
            { text: "Why bigint?", link: "/faq/why-bigint" },
            {
              text: "Why no built-in formatter?",
              link: "/faq/why-no-formatter",
            },
          ],
        },
        {
          text: "Resources",
          items: [{ text: "About", link: "/about" }],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/quarzo-life/moneta" },
    ],
    editLink: {
      pattern: "https://github.com/quarzo-life/moneta/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present Quarzo Life",
    },
  },
});
