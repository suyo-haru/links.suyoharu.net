# links.suyoharu.net

## これ何？

Fresh 2 / Preact のシンプルなリンク集。
[デジタル庁デザインシステム](https://design.digital.go.jp/dads/)の配色と読みやすさを参考にしています。

## 起動

```sh
deno install
deno task dev
```

## 編集

`content/profile.json` の `profile` と `links` を編集する。

```json
{ "title": "自分のブログ", "url": "https://example.com/blog", "group": "開発" }
```

- `description` を指定するとリンクの下に説明を表示。
- `group` に見出しを指定すると、同じ見出しのリンクをまとめて表示。
  - グループは最初に登場した順、グループ内のリンクは配列の順に表示
  - 省略・空欄なら見出しなしで表示
- `profile.avatar: "*.png"` は `static/*.png` を使用
  - 空欄なら文字のアバターになる
- `handle` と `bio`は省略・空欄で非表示

変更を反映するには再起動 (コンソールで `r` + `Enter`) する。

## 本番

**JSON はビルド時に取り込まれ、表示内容が固定される。**

```sh
deno task check
deno task test
deno task build
deno task start
```
