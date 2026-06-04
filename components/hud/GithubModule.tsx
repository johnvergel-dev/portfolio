"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Star,
  GitFork,
  Users,
  FolderGit2,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { fetchGithubData, type GithubData } from "@/lib/github";
import { siteConfig } from "@/data/site.config";
import { HudSection, Corners } from "@/components/hud/HudFrame";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Panel } from "@/components/ui/Panel";
import { Chip } from "@/components/ui/Chip";
import { MeterBar } from "@/components/ui/MeterBar";
import { Reveal } from "@/components/fx/Reveal";
import { CountUp } from "@/components/fx/CountUp";
import { Heatmap } from "@/components/hud/Heatmap";

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="telemetry flex items-center gap-1.5 text-[0.56rem] text-[var(--muted)]">
        <Icon size={12} /> {label}
      </span>
      <CountUp
        value={value}
        className="display text-2xl font-600 text-[var(--a)] sm:text-3xl"
      />
    </div>
  );
}

function StatusTag({ data }: { data: GithubData }) {
  const ok = data.status === "OK";
  return (
    <span className="telemetry inline-flex items-center gap-2 text-[0.62rem] text-[var(--muted)]">
      <span className="live-dot" aria-hidden />
      {ok ? "LIVE" : data.status.replace("_", " ")}
    </span>
  );
}

function LoadingState() {
  return (
    <Panel className="flex items-center justify-center px-6 py-16">
      <p className="telemetry animate-pulse text-[var(--muted)]">
        ACQUIRING SIGNAL <span className="text-[var(--a)]">{"//"}</span> SYNCING
        GITHUB TELEMETRY…
      </p>
    </Panel>
  );
}

export function GithubModule() {
  const [data, setData] = useState<GithubData | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    fetchGithubData(ac.signal)
      .then(setData)
      .catch((err: unknown) => {
        if ((err as Error)?.name === "AbortError") return;
        setData((prev) => prev ?? offline());
      });
    return () => ac.abort();
  }, []);

  return (
    <HudSection id="github" aria-label="GitHub activity" className="py-24">
      <SectionHeader
        index="01"
        title="GITHUB.FEED"
        status={data ? <StatusTag data={data} /> : undefined}
      />

      {!data ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-4">
          {data.message ? (
            <div className="glass flex items-center gap-2 px-4 py-2.5">
              <AlertTriangle
                size={14}
                className="shrink-0 text-[var(--signal)]"
              />
              <p className="telemetry text-[0.6rem] text-[var(--muted)]">
                {data.message}
              </p>
            </div>
          ) : null}

          {/* Identity + metrics */}
          <Reveal>
            <Panel className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {data.user?.avatarUrl ? (
                  <Image
                    src={data.user.avatarUrl}
                    alt={`${data.user.login} avatar`}
                    width={64}
                    height={64}
                    className="rounded-[2px] border border-[var(--line)]"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-[2px] border border-[var(--line)] bg-black/30">
                    <FolderGit2 size={24} className="text-[var(--muted)]" />
                  </div>
                )}
                <div>
                  <a
                    href={
                      data.user?.url ??
                      `https://github.com/${siteConfig.githubUser}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="display text-lg font-600 text-[var(--txt)] hover:text-[var(--a)]"
                  >
                    {data.user?.name ?? `@${siteConfig.githubUser}`}
                  </a>
                  <p className="telemetry text-[0.6rem] text-[var(--muted)]">
                    @{data.user?.login ?? siteConfig.githubUser}
                  </p>
                  {data.user?.bio ? (
                    <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
                      {data.user.bio}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
                <Metric icon={Star} label="STARS" value={data.totals.stars} />
                <Metric
                  icon={FolderGit2}
                  label="REPOS"
                  value={data.totals.publicRepos}
                />
                <Metric
                  icon={Users}
                  label="FOLLOWERS"
                  value={data.totals.followers}
                />
                {data.contributions ? (
                  <Metric
                    icon={Activity}
                    label="COMMITS / YR"
                    value={data.totals.contributions}
                  />
                ) : null}
              </div>
            </Panel>
          </Reveal>

          {/* Languages + heatmap */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.languages.length ? (
              <Reveal>
                <Panel
                  label="LANGUAGE DISTRIBUTION"
                  className="h-full p-6 pt-7"
                >
                  <div className="flex flex-col gap-4">
                    {data.languages.map((l) => (
                      <MeterBar key={l.name} label={l.name} value={l.percent} />
                    ))}
                  </div>
                </Panel>
              </Reveal>
            ) : null}

            {data.contributions ? (
              <Reveal>
                <Panel className="h-full p-6">
                  <Heatmap calendar={data.contributions} />
                </Panel>
              </Reveal>
            ) : null}
          </div>

          {/* Top repos */}
          {data.topRepos.length ? (
            <Reveal
              staggerChildren
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {data.topRepos.map((repo) => (
                <article
                  key={repo.name}
                  data-tilt
                  data-cursor="OPEN ↗"
                  className="glass group relative flex flex-col p-5"
                >
                  <Corners />
                  <div data-tilt-layer className="flex h-full flex-col">
                    <h3 className="display text-base font-600 text-[var(--txt)] transition-colors group-hover:text-[var(--a)]">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="after:absolute after:inset-0"
                      >
                        {repo.name}
                      </a>
                    </h3>
                    {repo.description ? (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                        {repo.description}
                      </p>
                    ) : null}
                    {repo.topics.length ? (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {repo.topics.map((t) => (
                          <li key={t}>
                            <Chip>{t}</Chip>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-auto flex items-center gap-4 pt-4 text-[var(--muted)]">
                      {repo.language ? (
                        <span className="telemetry text-[0.58rem] text-[var(--a)]">
                          {repo.language}
                        </span>
                      ) : null}
                      <span className="telemetry flex items-center gap-1 text-[0.58rem]">
                        <Star size={11} /> {repo.stars}
                      </span>
                      <span className="telemetry flex items-center gap-1 text-[0.58rem]">
                        <GitFork size={11} /> {repo.forks}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </Reveal>
          ) : null}
        </div>
      )}
    </HudSection>
  );
}

function offline(): GithubData {
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
    message: "GitHub feed offline — could not reach the API.",
  };
}
