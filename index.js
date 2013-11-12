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

/**
 * Generates a model getter function based on the name of the model.
 * @private
 *
 * @param {String} model Name of the model you'd like to return.
 *                       Should be the same as URI for the model.
 * @return getModel A model getter function.
 */
// TODO: Refactor this so urls may be passed as well.
// Maybe rename it to "_getEndpointGenerator"
function _getModelGenerator(model) {
    return function (fn) {
        var url = API_URL + '/' + model + '.json';

        _getJSON(url, fn);
    };
}

/**
 * Returns an array with all the categories available.
 * @param  {Function} fn Callback
 */
var getCategories = _getModelGenerator('category');

/**
 * Returns an array with all the developers available.
 * @param  {Function} fn Callback
 */
var getDevelopers = _getModelGenerator('developer');

/**
 * Returns an array with all the skills available.
 * @param  {Function} fn Callback
 */
var getSkills = _getModelGenerator('skill');

/**
 * Generaters a model getter function that filters by id.
 *
 * @param model
 * @return
 */
// TODO: Document this.
function _getModelByIdGenerator(model) {
    return function (id, fn) {
        // TODO: Find a clever way to do this.
        model = model + '/id/' + id;
        return _getModelGenerator(model)(fn);
    };
}

// TODO: Document this.
var getCategoryById = _getModelByIdGenerator('category');

// TODO: Document this.
var getDeveloperById = _getModelByIdGenerator('developer');

// TODO: Document this.
var getSkillById = _getModelByIdGenerator('skill');

module.exports = {
    getCategories: getCategories,
    getSkills: getSkills,
    getDevelopers: getDevelopers,
    getCategoryById: getCategoryById,
    getDeveloperById: getDeveloperById,
    getSkillById: getSkillById
};
