import { Head } from "fresh/runtime";
import { groupLinks } from "../lib/profile-config.ts";
import { profileConfig } from "../lib/profile.ts";
import { define } from "../utils.ts";

export default define.page(function Home() {
  const { profile, links } = profileConfig;
  const groups = groupLinks(links);
  const title = `${profile.name} | リンク集`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={profile.bio || `${profile.name}のリンク集`}
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={profile.bio || `${profile.name}のリンク集`}
        />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#0031d8" />
      </Head>
      <a class="skip-link" href="#main">本文へ移動</a>
      <main class="profile-page" id="main">
        <header class="profile">
          <div class="avatar">
            {profile.avatar
              ? (
                <img
                  src={profile.avatar}
                  width="104"
                  height="104"
                  alt=""
                />
              )
              : <span aria-hidden="true">{profile.initials}</span>}
          </div>
          <h1>{profile.name}</h1>
          {profile.handle && <p class="handle">{profile.handle}</p>}
          {profile.bio && <p class="bio">{profile.bio}</p>}
        </header>

        <nav class="links" aria-label="プロフィールのリンク集">
          {groups.map((group, index) => (
            <section
              class="link-group"
              key={group.title}
              aria-labelledby={group.title ? `link-group-${index}` : undefined}
            >
              {group.title && <h2 id={`link-group-${index}`}>{group.title}</h2>}
              <ul>
                {group.links.map((link) => {
                  const isMail = new URL(link.url).protocol === "mailto:";
                  return (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target={isMail ? undefined : "_blank"}
                        rel={isMail ? undefined : "noopener noreferrer"}
                      >
                        <span class="link-text">
                          <span class="link-title">{link.title}</span>
                          {link.description && (
                            <span class="link-description">
                              {link.description}
                            </span>
                          )}
                        </span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                        >
                          {isMail
                            ? (
                              <>
                                <rect
                                  x="2"
                                  y="4"
                                  width="20"
                                  height="16"
                                  rx="2"
                                />
                                <path d="m3 6 9 7 9-7" />
                              </>
                            )
                            : (
                              <path d="M14 3h7v7m0-7L10 14M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6" />
                            )}
                        </svg>
                        {!isMail && (
                          <span class="sr-only">（新しいタブで開きます）</span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </nav>
      </main>
    </>
  );
});
