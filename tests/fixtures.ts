/** Mock /api/github payloads (kept as plain objects — no app imports). */

const weeks = Array.from({ length: 53 }, () => ({
  days: Array.from({ length: 7 }, (_, i) => ({
    date: `2025-01-${String((i % 28) + 1).padStart(2, "0")}`,
    count: i,
    level: (i % 5) as 0 | 1 | 2 | 3 | 4,
  })),
}));

export const githubOk = {
  status: "OK",
  authenticated: true,
  user: {
    login: "johnvergel-dev",
    name: "John Vergel",
    bio: "Building things.",
    avatarUrl: null,
    url: "https://github.com/johnvergel-dev",
    followers: 42,
    following: 10,
  },
  totals: {
    stars: 128,
    forks: 24,
    publicRepos: 18,
    followers: 42,
    contributions: 1234,
  },
  languages: [
    { name: "TypeScript", count: 9, percent: 50 },
    { name: "Python", count: 5, percent: 28 },
    { name: "Go", count: 4, percent: 22 },
  ],
  topRepos: [
    {
      name: "alpha-engine",
      description: "A test repository.",
      stars: 80,
      forks: 10,
      language: "TypeScript",
      url: "https://github.com/johnvergel-dev/alpha-engine",
      topics: ["web", "gsap"],
    },
  ],
  contributions: { total: 1234, weeks },
  updatedAt: "2025-01-01T00:00:00.000Z",
};

export const githubOffline = {
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
  updatedAt: "2025-01-01T00:00:00.000Z",
  message: "GitHub feed offline — could not reach the API.",
};
