module.exports = {
  experimental: {
    serverActions: true,
  },
  async rewrites() {
  return [
    {
      source: "/api/uploadthing",
      destination: "/api/airtable-insert/uploadthing",
    },
  ];
}

};
