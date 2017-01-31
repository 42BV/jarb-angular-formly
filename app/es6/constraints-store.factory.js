'use strict';

/**
 * @ngdoc service
 * @name jarb-angular-formly.constraintsStore
 * @description
 * Stores the contraints for the 'jarb-angular-formly' library.
 * Constraints define when the  properties of an Entity are valid.
 * For example the name of a SuperHero enitity is required and has
 * a maximum length of 50.
 *
 * You are supposed to fill it as soon as possible yourself, by calling
 * loadConstraints with the appropriate URL.
 *
 * Notifies all jarbInput's when the constraints change so they can apply
 * the constraints.
 */
angular.module('jarb-angular-formly')
  .factory('constraintsStore', function($http) {

    /**
     * The _constraints should has the following signature:
     *
     * {
     *   "SuperHero": {
     *     "name": {
     *       "javaType": "java.lang.String",
     *       "types": ["text"],
     *       "required": true,
     *       "minimumLength": null,
     *       "maximumLength": 50,
     *       "fractionLength": null,
     *       "radix": null,
     *       "pattern": null,
     *       "min": null,
     *       "max": null,
     *       "name": "name"
     *     },
     *     "email": {
     *       "javaType": "java.lang.String",
     *       "types": ["email", "text"],
     *       "required": true,
     *       "minimumLength": null,
     *       "maximumLength": 255,
     *       "fractionLength": null,
     *       "radix": null,
     *       "pattern": null,
     *       "min": null,
     *       "max": null,
     *       "name": "email"
     *     }
     * }
     *
     * The keys represent the name of the class, in the above case 'SuperHero', each class
     * has fields such as the 'name', and 'email', these are described in an object of the
     * same name. These 'validator' objects look like this:
     *
     * {
     *   "javaType": string,          // The Java class name of this validator
     *   "types":Array<string>,       // The type that closest represents this validator
     *   "required":true,             // Wether or not the validator is required.
     *   "minimumLength":int,         // Minimum length of the input string.
     *   "maximumLength":int,         // Maximum length of the input string.
     *   "fractionLength":int,        // The number of nubmers after the dot if input is a number.
     *   "radix": int,                // Radix for the when type is number: @See http://en.wikipedia.org/wiki/Radix. Is not used.
     *   "pattern": string,           // The regex in Java form the input must be valid for. Is not used.
     *   "min": int,                  // The maximum int value, is not used.
     *   "max": int,                  // The minimum int value, is not used.
     *   "name": string               // The name of the property this validator represents.
     * }
     *
     */
    let _constraints = null;

    // Holds the callbacks to 'jarbInput' directives who want to know when to update.
    const _onConstraintsChangedCallbacks = [];

    return { loadConstraints, getConstraints, setConstraints, onConstraintsChanged };

    /**
     * Loads the constraints and sets the constraints to the constraintsStore.
     *
     * @param {String} url A string represeting a url end-point from which to load the constraints from.
     * @returns {Promise} A promise containing the result of the HTTP request.
     */
    function loadConstraints(url) {
      return $http.get(url).then(function(result) {
        const constraints = result.data;
        setConstraints(constraints);
        return result;
      });
    }

    /**
     * Returns the constraints from the store.
     *
     * @return {constraints} The constraints from the store
     */
    function getConstraints() {
      return _constraints;
    }

    /**
     * Set new constraints for the store, calls 'onConstraintsChanged' callbacks for observers.
     *
     * @param {constraints} constraints The new constraints
     */
    function setConstraints(constraints) {
      _constraints = constraints;

      // Notify 'jarbInput' directives that the constraints have been set.
      _.each(_onConstraintsChangedCallbacks, function(callback) {
        callback(_constraints); // Give _constraints for convenience.
      });
    }

     /**
     * Registers a callback function for when the constraints change.
     *
     * @param {fn(constraints) -> void} callback The function that handles the constraints changed event.
     * @return {Function} a function which can be used to de-register from the constraints changed event.
     */
    function onConstraintsChanged(callback) {
      function deregister() {
        const index = _onConstraintsChangedCallbacks.indexOf(callback);
        _onConstraintsChangedCallbacks.splice(index, 1);
      }

      _onConstraintsChangedCallbacks.push(callback);

      return deregister;
    }
  });
