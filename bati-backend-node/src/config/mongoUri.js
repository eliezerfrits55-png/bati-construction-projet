const normalizeMongoUri = (value) => {
  if (!value) return value;

  // Accept the legacy Atlas value where the database name was placed in the query string.
  return value.replace(
    /\?bati_construction=Cluster0\/?$/i,
    "/bati_construction?retryWrites=true&w=majority",
  );
};

module.exports = { normalizeMongoUri };
