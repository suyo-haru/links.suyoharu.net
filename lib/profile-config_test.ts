import config from "../content/profile.json" with { type: "json" };
import { groupLinks, parseProfileConfig } from "./profile-config.ts";

function expectInvalidUrl(url: string) {
  try {
    parseProfileConfig({
      profile: { name: "Test" },
      links: [{ title: "Link", url }],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("links[0].url")) {
      return;
    }
    throw error;
  }
  throw new Error("不正な URL が受理されました");
}

Deno.test("編集用 JSON が妥当である", () => {
  parseProfileConfig(config);
});
Deno.test("スクリプト・データ URL・不正 URL を拒否する", () => {
  for (
    const url of [
      "javascript:alert(1)",
      "data:text/html,test",
      "invalid",
      "mailto:",
    ]
  ) expectInvalidUrl(url);
});
Deno.test("最小限の設定とメールリンクを受理する", () => {
  const parsed = parseProfileConfig({
    profile: { name: "Test" },
    links: [{ title: "Email", url: "mailto:hello@example.com" }],
  });
  if (parsed.profile.initials !== "T" || parsed.links[0].description !== "") {
    throw new Error("省略値の補完が不正です");
  }
});
Deno.test("リンク未登録のプロフィールを受理する", () => {
  parseProfileConfig({ profile: { name: "Test" }, links: [] });
});

Deno.test("同じグループをまとめ、登場順とグループ内のリンク順を保つ", () => {
  const parsed = parseProfileConfig({
    profile: { name: "Test" },
    links: [
      { title: "X", url: "https://example.com/x", group: "SNS" },
      { title: "GitHub", url: "https://example.com/github", group: "開発" },
      { title: "Bluesky", url: "https://example.com/bluesky", group: "SNS" },
    ],
  });
  const result = groupLinks(parsed.links).map((group) => ({
    title: group.title,
    links: group.links.map((link) => link.title),
  }));
  const expected = [
    { title: "SNS", links: ["X", "Bluesky"] },
    { title: "開発", links: ["GitHub"] },
  ];
  if (JSON.stringify(result) !== JSON.stringify(expected)) {
    throw new Error("グループまたはリンクの表示順が不正です");
  }
});

Deno.test("グループ省略・空欄は見出しなしとしてまとめる", () => {
  const parsed = parseProfileConfig({
    profile: { name: "Test" },
    links: [
      { title: "One", url: "https://example.com/one" },
      { title: "Two", url: "https://example.com/two", group: "  " },
    ],
  });
  const groups = groupLinks(parsed.links);
  if (
    groups.length !== 1 || groups[0].title !== "" ||
    groups[0].links.length !== 2
  ) {
    throw new Error("見出しなしのリンクを保持できませんでした");
  }
});
