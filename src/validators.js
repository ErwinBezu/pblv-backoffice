// Retourne undefined si OK, sinon un message d'erreur (pattern RA)
export const urlOrEmpty = (value) => {
  if (value == null || value === "") return undefined;
  // On autorise sans schéma en le préfixant visuellement (ex: "exemple.fr")
  const val = value.includes("://") ? value : `https://${value}`;
  try {
    // new URL lève si invalide
    new URL(val);
    return undefined;
  } catch {
    return "URL invalide (ex: https://exemple.fr)";
  }
};

// Normalise la valeur à envoyer au back (préfixe https:// si manquant)
export const normalizeUrlOrEmpty = (value) => {
  if (value == null || value === "") return undefined;
  return value.includes("://") ? value : `https://${value}`;
};
