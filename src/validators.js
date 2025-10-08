export const urlOrEmpty = (value) => {
  if (value == null || value === "") return undefined;
  const val = value.includes("://") ? value : `https://${value}`;
  try {
    new URL(val);
    return undefined;
  } catch {
    return "URL invalide (ex: https://exemple.fr)";
  }
};

export const normalizeUrlOrEmpty = (value) => {
  if (value == null || value === "") return undefined;
  return value.includes("://") ? value : `https://${value}`;
};
