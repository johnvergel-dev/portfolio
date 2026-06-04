/**
 * GitHub integration types + pure aggregation + client fetcher.
 *
 * Network calls (which use the secret PAT) live in the server route handler
 * `app/api/github/route.ts`. This module is safe to import from the client:
 * it contains only types, pure transforms and a `fetch('/api/github')` helper.
 */

export type GithubStatus =
  | "OK" // token + GraphQL + REST all good
  | "PARTIAL" // no token: REST stats only, no contribution calendar
  | "RATE_LIMIT" // GitHub rate limit hit
  | "USER_NOT_FOUND" // bad username
  | "OFFLINE"; // network/timeout/unknown error

export interface GithubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  url: string;
  followers: number;
  following: number;
}

export interface LanguageStat {
  name: string;
  count: number;
  percent: number; // 0–100, rounded
}

export interface RepoCard {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  total: number;
  weeks: { days: ContributionDay[] }[];
}

export interface GithubData {
  status: GithubStatus;
  authenticated: boolean;
  user: GithubUser | null;
  totals: {
    stars: number;
    forks: number;
    publicRepos: number;
    followers: number;
    contributions: number;
  };
  languages: LanguageStat[];
  topRepos: RepoCard[];
  contributions: ContributionCalendar | null;
  updatedAt: string;
  message?: string;
}

/* ------------------------------ raw shapes ------------------------------ */

export interface RawRestRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
}

export interface RawGraphCalendarDay {
  date: string;
  contributionCount: number;
  color: string;
}

/* --------------------------- pure aggregation --------------------------- */

/** Count primary languages across non-fork repos, top `limit`, with %. */
export function aggregateLanguages(
  repos: RawRestRepo[],
  limit = 8,
): LanguageStat[] {
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.fork || !r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Top repos by stars (forks excluded), mapped to display cards. */
export function pickTopRepos(repos: RawRestRepo[], limit = 6): RepoCard[] {
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit)
    .map((r) => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      url: r.html_url,
      topics: (r.topics ?? []).slice(0, 4),
    }));
}

export function sumStars(repos: RawRestRepo[]): number {
  return repos.reduce((acc, r) => acc + (r.fork ? 0 : r.stargazers_count), 0);
}

export function sumForks(repos: RawRestRepo[]): number {
  return repos.reduce((acc, r) => acc + (r.fork ? 0 : r.forks_count), 0);
}

/** Map a daily contribution count to a 0–4 intensity level for the heatmap. */
export function contributionLevel(count: number): ContributionDay["level"] {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

/** Normalize the GraphQL contribution calendar into our display shape. */
export function normalizeContributions(
  total: number,
  weeks: { contributionDays: RawGraphCalendarDay[] }[],
): ContributionCalendar {
  return {
    total,
    weeks: weeks.map((w) => ({
      days: w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: contributionLevel(d.contributionCount),
      })),
    })),
  };
}

/* ----------------------------- client fetch ----------------------------- */

/** Client-side fetch of the normalized payload from the route handler. */
export async function fetchGithubData(
  signal?: AbortSignal,
): Promise<GithubData> {
  const res = await fetch("/api/github", { signal });
  if (!res.ok) {
    return {
      status: "OFFLINE",
      authenticated: false,
      user: null,
      totals: {
        stars: 0,
        forks: 0,
        publicRepos: 0,
        followers: 0,
        contributions: 0,
      },
      languages: [],
      topRepos: [],
      contributions: null,
      updatedAt: new Date().toISOString(),
      message: `Feed unavailable (HTTP ${res.status}).`,
    };
  }
  return (await res.json()) as GithubData;
}
