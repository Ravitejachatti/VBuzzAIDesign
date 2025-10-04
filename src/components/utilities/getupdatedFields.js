function getUpdatedFields(original, updated) {
  const diff = {};

  for (const key in updated) {
    if (
      updated[key] !== undefined &&
      updated[key] !== original[key] &&
      JSON.stringify(updated[key]) !== JSON.stringify(original[key])
    ) {
      diff[key] = updated[key];
    }
  }

  return diff;
}

export default getUpdatedFields