const common = {
  require: [
    'step_definitions/**/*.js',
    'step_definitions/hooks.js',
    'step_definitions/world.js'
  ],
  format: [
    'progress-bar',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    'junit:reports/cucumber-junit.xml'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  publishQuiet: true
};

export default {
  default: {
    ...common,
    parallel: 2
  },
  parallel: {
    ...common,
    parallel: 4
  },
  serial: {
    ...common,
    parallel: 1
  }
};
