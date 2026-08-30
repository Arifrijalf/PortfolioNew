module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      startServerCommand: 'npx serve dist -l 3000',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
