/* config-overrides.js */
/* Not LOADED */
const webpack = require('webpack');
module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.resolve.fallback = {
        crypto: false
    };

    return config;
}
