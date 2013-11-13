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
            // FIXME: 40x and 50x response status codes should be accounted as errors.
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
            console.log(url);

            var json = JSON.parse(result);

            fn(null, json);
        } catch (e) {
            var err = new Error('Unable to parse JSON.', e);
            err.inner = e;

            throw err;
        }
    });
}

/**
 * Returns the API URL for the specified enpoint.
 * @private
 * @param  {String} endpoint Name of the entity to get URL for.
 * @return {String}          URL to the specified endpoint.
 */
function _resolveURL(endpoint) {
    var url = API_URL + '/' + endpoint + '.json';

    return url;
}

/**
 * Generates a model getter function based on the name of the model.
 * @private
 * @param {String} endpoint Name of the model you'd like to return.
 *                          Should be the same as URI for the model.
 * @return {Function} getModel A model getter function.
 */
function _getModelGenerator(endpoint) {
    return function (fn) {
        var url = _resolveURL(endpoint);

        _getJSON(url, fn);
    };
}

/**
 * Returns an array with all the categories available.
 * @param {Function} fn Callback
 */
var getCategories = _getModelGenerator('category');

/**
 * Returns an array with all the developers available.
 * @param {Function} fn Callback
 */
var getDevelopers = _getModelGenerator('developer');

/**
 * Returns an array with all the skills available.
 * @param {Function} fn Callback
 */
var getSkills = _getModelGenerator('skill');

/**
 * Generaters a model getter function that filters by id.
 * @param {String} endpoint Name of the model you'd like to return.
 * @return {Function} getModelById A model getter function that filters by id.
 */
function _getModelByIdGenerator(endpoint) {
    return function (id, fn) {
        // TODO: Find a clever way to do this.
        endpoint = endpoint + '/id/' + id;
        return _getModelGenerator(endpoint)(fn);
    };
}

/**
 * Returns a single category by id.
 * @param {Number} id Unique integer that identifies a category.
 * @param {Function} fn Callback
 */
var getCategoryById = _getModelByIdGenerator('category');

/**
 * Returns a single developer by id.
 * @param {Number} id Unique integer that identifies a developer.
 * @param {Function} fn Callback
 */
var getDeveloperById = _getModelByIdGenerator('developer');

/**
 * Returns a single skill by id.
 * @param {Number} id Unique integer that identifies a skill.
 * @param {Function} fn Callback
 */
var getSkillById = _getModelByIdGenerator('skill');

module.exports = {
    getCategories: getCategories,
    getSkills: getSkills,
    getDevelopers: getDevelopers,
    getCategoryById: getCategoryById,
    getDeveloperById: getDeveloperById,
    getSkillById: getSkillById
};
