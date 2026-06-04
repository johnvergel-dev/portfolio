"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import type { Profile, ProfileId } from "@/types";
import { getProfile, profiles, isProfileId } from "@/data/profiles";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { registerGsap, gsap } from "@/lib/gsap";

const PROFILE_IDS = profiles.map((p) => p.id) as [ProfileId, ...ProfileId[]];
const STORAGE_KEY = "ophud:perfil";

interface ProfileContextValue {
  profile: Profile;
  profileId: ProfileId;
  setProfile: (id: ProfileId) => void;
  /** Increments on every loadout change — drives the reconfiguration FX. */
  transitionNonce: number;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within <ProfileProvider>");
  return ctx;
}

export function ProfileProvider({
  initialProfile,
  children,
}: {
  initialProfile: ProfileId;
  children: ReactNode;
}) {
  // Canonical state lives in the URL (?perfil=). Shallow updates → no reload.
  const [profileId, setProfileId] = useQueryState(
    "perfil",
    parseAsStringLiteral(PROFILE_IDS)
      .withDefault(initialProfile)
      .withOptions({ history: "push", shallow: true, scroll: false }),
  );

  const [transitionNonce, setTransitionNonce] = useState(0);
  const reduced = usePrefersReducedMotion();
  const scopeRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<string>(getProfile(initialProfile).accent);
  const retintTween = useRef<ReturnType<typeof gsap.to> | null>(null);

  const setProfile = useCallback(
    (id: ProfileId) => {
      if (id === profileId || !isProfileId(id)) return;
      setProfileId(id);
      setTransitionNonce((n) => n + 1);
      try {
        window.localStorage.setItem(STORAGE_KEY, id);
      } catch {
        /* storage may be unavailable (private mode) — non-fatal */
      }
    },
    [profileId, setProfileId],
  );

  // Soft persistence: on first mount, if the URL has no ?perfil, recall the
  // last loadout from localStorage. Done post-mount to avoid hydration drift.
  useEffect(() => {
    const hasParam = new URLSearchParams(window.location.search).has("perfil");
    if (hasParam) return;
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (stored && isProfileId(stored) && stored !== profileId) {
      setProfileId(stored);
    }
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retint `--a` smoothly (or instantly under reduced motion) on change.
  useEffect(() => {
    const el = scopeRef.current;
    if (!el) return;
    const target = getProfile(profileId).accent;
    const from = accentRef.current;
    if (target === from) return;

    if (reduced) {
      el.style.setProperty("--a", target);
      accentRef.current = target;
      return;
    }

    registerGsap();
    retintTween.current?.kill();
    const proxy = { t: 0 };
    retintTween.current = gsap.to(proxy, {
      t: 1,
      duration: 0.7,
      ease: "expoOut",
      onUpdate: () => {
        el.style.setProperty(
          "--a",
          gsap.utils.interpolate(from, target, proxy.t),
        );
      },
    });
    accentRef.current = target;
    return () => {
      retintTween.current?.kill();
    };
  }, [profileId, reduced]);

  const profile = getProfile(profileId);

  return (
    <ProfileContext.Provider
      value={{ profile, profileId, setProfile, transitionNonce }}
    >
      <div
        ref={scopeRef}
        data-profile={profileId}
        style={{ ["--a" as string]: profile.accent } as React.CSSProperties}
      >
        {children}
      </div>
    </ProfileContext.Provider>
  );
}
