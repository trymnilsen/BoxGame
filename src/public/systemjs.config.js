(function (global) {
  System.config({
    paths: {
      // paths serve as alias
      'npm:': 'node_modules/'
    },
    // map tells the System loader where to look for things
    map: {
      // our app is within the app folder
      app: '/static/js/build',

    },
    // packages tells the System loader how to load when no filename and/or no extension
    packages: {
      app: {
        main: './client/game.js',
        defaultExtension: 'js'
      }
    }
  });
})(this);