/**
 * URL to the Dominican Developer Skills API.
 * @type {String}
 */
var API_URL = 'http://skills-devdom.herokuapp.com/api';

/**
 * A wrapper for the `http.get` method.
 * @private
 * @param  {String}   url URL to request.
 * @param  {Function} fn  Callback
 *                        First argument is `err`, second is `result`.
 */
function _get(url, fn) {
    var http = require('http');

    http.get(url, function (res) {
        var buff = '';

        // TODO: Find a clever way to do this.
        res.on('data', function (d) {
            buff += d;
        });

        res.on('error', function (err) {
            fn(err, null);
        });

        res.on('end', function () {
            fn(null, buff);
        });
    });
}

/**
 * Same as `_get` but with JSON.
 * @private
 * @param  {String}   url URL to request.
 * @param  {Function} fn  Callback
 */
function _getJSON(url, fn) {
    _get(url, function (err, result) {
        if (err) {
            fn(err, null);

            return;
        }

        try {
            var json = JSON.parse(result);

            fn(null, json);
        } catch (e) {
            var err = new Error('Unable to parse JSON.', e);
            err.inner = e;

            throw err;
        }
    });
}

// TODO:
//
// Refactor getter methods.
// Use closures to abstract the 'changing' parts.

/**
 * Returns an array with all the categories available.
 * @param  {Function} fn Callback
 */
function getCategories(fn) {
    var url = API_URL + '/category' + '.json';

    _getJSON(url, fn);
}

/**
 * Returns an array with all the skills available.
 * @param  {Function} fn Callback
 */
function getSkills(fn) {
    var url = API_URL + '/skill' + '.json';

    // _getJSON(url, fn);

    var err = new Error('Method not supported by API.');

    fn(err, null);
}

/**
 * Returns an array with all the developers available.
 * @param  {Function} fn Callback
 */
function getDevelopers(fn) {
    var url = API_URL + '/developer' + '.json';

    _getJSON(url, fn);
}

module.exports = {
    getCategories: getCategories,
    getSkills: getSkills,
    getDevelopers: getDevelopers
};