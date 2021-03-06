import { computeDomain } from "custom-card-helpers";


export function matchPattern(pattern: string, value: string) {
  let res = false;
  if (pattern.match(/^[a-z0-9_\.]+$/)) {
    if (pattern.includes('.')) res = pattern == value;
    else res = pattern == computeDomain(value);
  } else {
    try {
      if ((pattern.startsWith('/') && pattern.endsWith('/')) || pattern.indexOf('*') !== -1) {
        if (!pattern.startsWith('/')) {
          pattern = pattern.replace(/\./g, '.').replace(/\*/g, '.*');
          pattern = `/^${pattern}$/`;
        }
        const regex = new RegExp(pattern.slice(1, -1));
        res = regex.test(value);
      }
    } catch (e) { }
  }
  return res;
}

export function applyFilters(value: string, config: { include?: string[]; exclude?: string[] }) {
  if (!config.include || !config.include.length) return false;
  if (config.include && !config.include.find(e => matchPattern(e, value))) return false;
  if (config.exclude && config.exclude.find(e => matchPattern(e, value))) return false;
  return true;
}
