export type EnvFlag = { DEV?: boolean };

export function isLocalEditEnabled(env: EnvFlag = import.meta.env): boolean {
  return env.DEV === true;
}
