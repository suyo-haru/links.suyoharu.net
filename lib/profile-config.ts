export interface ProfileLink {
  title: string;
  url: string;
  description: string;
  group: string;
}

export interface ProfileConfig {
  profile: {
    name: string;
    handle: string;
    bio: string;
    avatar: string;
    initials: string;
  };
  links: ProfileLink[];
}

export function groupLinks(links: ProfileLink[]) {
  const groups = new Map<string, ProfileLink[]>();
  for (const link of links) {
    const group = groups.get(link.group);
    if (group) group.push(link);
    else groups.set(link.group, [link]);
  }
  return Array.from(groups, ([title, links]) => ({ title, links }));
}

function fail(path: string, reason: string): never {
  throw new Error(`content/profile.json: ${path} ${reason}`);
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(path, "はオブジェクトで指定してください。");
  }
  return value as Record<string, unknown>;
}

function string(value: unknown, path: string, optional = false): string {
  if (optional && value === undefined) return "";
  if (typeof value !== "string" || (!optional && !value.trim())) {
    fail(path, "は文字列で指定してください（必須項目は空欄にできません）。");
  }
  return value;
}

export function parseProfileConfig(value: unknown): ProfileConfig {
  const root = object(value, "設定");
  const profile = object(root.profile, "profile");
  const name = string(profile.name, "profile.name");
  const initials = profile.initials === undefined
    ? [...name][0]
    : string(profile.initials, "profile.initials");
  if ([...initials].length > 3) {
    fail("profile.initials", "は3文字以内で指定してください。");
  }
  const avatar = string(profile.avatar, "profile.avatar", true);
  if (
    avatar &&
    !(/^\/(?!\/)/.test(avatar) || /^https?:\/\//.test(avatar))
  ) {
    fail(
      "profile.avatar",
      "は / で始まる画像パスか HTTP(S) URL で指定してください。",
    );
  }
  if (!Array.isArray(root.links)) fail("links", "は配列で指定してください。");
  const links = root.links.map((value, i) => {
    const path = `links[${i}]`;
    const link = object(value, path);
    const url = string(link.url, `${path}.url`);
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      fail(`${path}.url`, "は有効な URL で指定してください。");
    }
    if (
      !["https:", "http:", "mailto:"].includes(parsed.protocol) ||
      (parsed.protocol === "mailto:" && !parsed.pathname)
    ) fail(`${path}.url`, "は HTTP(S) URL または mailto: で指定してください。");
    return {
      title: string(link.title, `${path}.title`),
      url,
      description: string(link.description, `${path}.description`, true),
      group: string(link.group, `${path}.group`, true).trim(),
    };
  });
  return {
    profile: {
      name,
      initials,
      avatar,
      handle: string(profile.handle, "profile.handle", true),
      bio: string(profile.bio, "profile.bio", true),
    },
    links,
  };
}
