// See http://brunch.io for documentation.
exports.files = {
  javascripts: {
    joinTo: {
      'javascripts/app.js': /^app/,
      // 'javascripts/vendor.js': /^(?!app)/
    },
    entryPoints: {
      'app/initialize.js': 'javascripts/app.js'
    }
  },
  stylesheets: {
    joinTo: 'stylesheets/app.css'
  }
};
