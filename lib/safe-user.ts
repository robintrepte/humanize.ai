import type { User } from "@/db/schema";

/** Public-safe user fields — never include password hashes. */
export type PublicUser = Omit<User, "password">;

export function toPublicUser(u: User): PublicUser {
  const { password: _password, ...safe } = u;
  return safe;
}
