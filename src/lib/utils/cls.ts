export const cls = (...xs: Array<string | false | undefined | null>) =>
  xs.filter(Boolean).join(" ");
