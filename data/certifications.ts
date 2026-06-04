import type { Certification } from "@/types";

/**
 * Certifications — intentionally EMPTY in v1.
 *
 * The `CertificationsModule` renders a "MODULE LOCKED" stub while this array is
 * empty. To activate the module, just push real entries here (with `tags`) —
 * no component changes needed:
 *
 *   export const certifications: Certification[] = [
 *     {
 *       name: "AWS Certified Solutions Architect",
 *       issuer: "Amazon Web Services",
 *       year: 2024,
 *       href: "https://...",
 *       tags: ["backend"],
 *     },
 *   ];
 */
export const certifications: Certification[] = [];
