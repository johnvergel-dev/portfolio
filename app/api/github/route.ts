import { siteConfig } from "@/data/site.config";
import {
  aggregateLanguages,
  pickTopRepos,
  sumStars,
  sumForks,
  normalizeContributions,
  type GithubData,
  type GithubStatus,
  type GithubUser,
  type RawRestRepo,
  type RawGraphCalendarDay,
} from "@/lib/github";

/**
 * Live GitHub telemetry, cached at the route level so GitHub is hit at most
 * once per hour (a GraphQL POST is not eligible for the per-fetch Data Cache,
 * so we cache the whole computed response instead). The fine-grained PAT is
 * read from the server env and never exposed to the client. The handler never
 * throws — every failure maps to a status the HUD renders gracefully.
 *
 * Note: `?user=` is intentionally ignored (force-static can't read the query);
 * the portfolio always reports its owner, `siteConfig.githubUser`.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

const GRAPHQL = "https://api.github.com/graphql";
const TIMEOUT_MS = 8000;

type GraphUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  url: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: { totalCount: number };
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: { contributionDays: RawGraphCalendarDay[] }[];
    };
  };
};

class GithubError extends Error {
  constructor(readonly kind: Exclude<GithubStatus, "OK" | "PARTIAL">) {
    super(kind);
  }
}

function headers(token?: string): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "operator-hud-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function statusFromResponse(
  res: Response,
): Exclude<GithubStatus, "OK" | "PARTIAL"> | null {
  if (res.status === 404) return "USER_NOT_FOUND";
  if (res.status === 403 || res.status === 429) return "RATE_LIMIT";
  if (!res.ok) return "OFFLINE";
  return null;
}

async function fetchRepos(
  user: string,
  token: string | undefined,
  signal: AbortSignal,
): Promise<RawRestRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated&type=owner`,
    { headers: headers(token), signal },
  );
  const bad = statusFromResponse(res);
  if (bad) throw new GithubError(bad);
  return (await res.json()) as RawRestRepo[];
}

async function fetchProfileRest(
  user: string,
  signal: AbortSignal,
): Promise<GithubUser> {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(user)}`,
    { headers: headers(), signal },
  );
  const bad = statusFromResponse(res);
  if (bad) throw new GithubError(bad);
  const u = (await res.json()) as {
    login: string;
    name: string | null;
    bio: string | null;
    avatar_url: string | null;
    html_url: string;
    followers: number;
    following: number;
    public_repos: number;
  };
  return {
    login: u.login,
    name: u.name,
    bio: u.bio,
    avatarUrl: u.avatar_url,
    url: u.html_url,
    followers: u.followers,
    following: u.following,
  };
}

async function fetchGraph(
  user: string,
  token: string,
  signal: AbortSignal,
): Promise<GraphUser> {
  const query = `query($login:String!){user(login:$login){login name bio avatarUrl url followers{totalCount} following{totalCount} repositories(privacy:PUBLIC,ownerAffiliations:OWNER){totalCount} contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount color}}}}}}`;
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login: user } }),
    signal,
  });
  if (res.status === 403 || res.status === 429)
    throw new GithubError("RATE_LIMIT");
  if (!res.ok) throw new GithubError("OFFLINE");
  const json = (await res.json()) as {
    data?: { user: GraphUser | null };
    errors?: unknown[];
  };
  if (json.errors?.length) throw new GithubError("OFFLINE");
  const u = json.data?.user;
  if (!u) throw new GithubError("USER_NOT_FOUND");
  return u;
}

function empty(
  status: GithubStatus,
  authenticated: boolean,
  message?: string,
): GithubData {
  return {
    status,
    authenticated,
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
    message,
  };
}

export async function GET(): Promise<Response> {
  const user = siteConfig.githubUser;
  const token = process.env.GITHUB_TOKEN?.trim() || undefined;
  const authenticated = Boolean(token);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const [reposR, extraR] = await Promise.allSettled([
      fetchRepos(user, token, controller.signal),
      authenticated
        ? fetchGraph(user, token!, controller.signal)
        : fetchProfileRest(user, controller.signal),
    ]);

    // Repos are the backbone — if they fail, surface the failure status.
    if (reposR.status === "rejected") {
      const reason = reposR.reason;
      const status: GithubStatus =
        reason instanceof GithubError ? reason.kind : "OFFLINE";
      return json(empty(status, authenticated, messageFor(status)));
    }

    const repos = reposR.value;
    const data: GithubData = {
      status: "OK",
      authenticated,
      user: null,
      totals: {
        stars: sumStars(repos),
        forks: sumForks(repos),
        publicRepos: repos.length,
        followers: 0,
        contributions: 0,
      },
      languages: aggregateLanguages(repos),
      topRepos: pickTopRepos(repos),
      contributions: null,
      updatedAt: new Date().toISOString(),
    };

    if (authenticated) {
      if (extraR.status === "fulfilled") {
        const u = extraR.value as GraphUser;
        const cal = u.contributionsCollection.contributionCalendar;
        data.user = {
          login: u.login,
          name: u.name,
          bio: u.bio,
          avatarUrl: u.avatarUrl,
          url: u.url,
          followers: u.followers.totalCount,
          following: u.following.totalCount,
        };
        data.totals.followers = u.followers.totalCount;
        data.totals.publicRepos = u.repositories.totalCount || repos.length;
        data.totals.contributions = cal.totalContributions;
        data.contributions = normalizeContributions(
          cal.totalContributions,
          cal.weeks,
        );
      } else {
        // Repo stats are valid; contribution telemetry is not.
        data.status = "PARTIAL";
        data.user = {
          login: user,
          name: null,
          bio: null,
          avatarUrl: null,
          url: `https://github.com/${user}`,
          followers: 0,
          following: 0,
        };
        data.message = "Contribution telemetry unavailable.";
      }
    } else {
      data.status = "PARTIAL";
      data.message =
        "Set GITHUB_TOKEN for contribution telemetry (unauthenticated REST).";
      if (extraR.status === "fulfilled") {
        const u = extraR.value as GithubUser;
        data.user = u;
        data.totals.followers = u.followers;
      } else {
        data.user = {
          login: user,
          name: null,
          bio: null,
          avatarUrl: null,
          url: `https://github.com/${user}`,
          followers: 0,
          following: 0,
        };
      }
    }

    return json(data);
  } catch (err) {
    const status: GithubStatus =
      err instanceof GithubError ? err.kind : "OFFLINE";
    return json(empty(status, authenticated, messageFor(status)));
  } finally {
    clearTimeout(timer);
  }
}

function messageFor(status: GithubStatus): string {
  switch (status) {
    case "RATE_LIMIT":
      return "GitHub rate limit reached — telemetry will refresh shortly.";
    case "USER_NOT_FOUND":
      return "GitHub user not found — check siteConfig.githubUser.";
    case "OFFLINE":
      return "GitHub feed offline — could not reach the API.";
    default:
      return "";
  }
}

function json(data: GithubData): Response {
  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
