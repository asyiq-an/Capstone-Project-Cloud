function dotProduct(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function magnitude(v) {
  return Math.sqrt(dotProduct(v, v));
}

function cosineSimilarity(a, b) {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b) || 1);
}

export function getRecommendations(dishes, liked, disliked) {
  const preferenceVector = Array(dishes[0].attributes.length).fill(0);

  liked.forEach((d) => {
    d.attributes.forEach((val, i) => {
      preferenceVector[i] += val;
    });
  });

  disliked.forEach((d) => {
    d.attributes.forEach((val, i) => {
      preferenceVector[i] -= val;
    });
  });

  const triedNames = [...liked, ...disliked].map((d) => d.name);

  const candidates = dishes.filter((d) => !triedNames.includes(d.name));

  return candidates
    .map((d) => ({
      dish: d,
      score: cosineSimilarity(preferenceVector, d.attributes),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.dish); // Return all

}
