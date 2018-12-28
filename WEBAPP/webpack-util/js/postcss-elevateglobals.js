var postcss = require('postcss');

module.exports =
  postcss.plugin(
    'elevateGlobals',
    (opts) => {
      opts = opts || {};
      return (css/* , result */) => {
        css.walkRules(
          (rule) => {
            /* eslint-disable no-param-reassign */
            ['html', 'body'].forEach((elem) => {
              rule.selector =
                rule.selector.replace(`.${opts.prefix} ${elem}`,
                                      `.${opts.prefix}`);
            });
            /* eslint-enable no-param-reassign */
        });
      }
    }
  );
