'use strict';

angular.module('jarb-angular-formly', []);
//# sourceMappingURL=index.js.map
;'use strict';

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

angular.module('jarb-angular-formly').factory('constraintsStore', ["$http", function ($http) {

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
  var _constraints = null;

  // Holds the callbacks to 'jarbInput' directives who want to know when to update.
  var _onConstraintsChangedCallbacks = [];

  return { loadConstraints: loadConstraints, getConstraints: getConstraints, setConstraints: setConstraints, onConstraintsChanged: onConstraintsChanged };

  /**
   * Loads the constraints and sets the constraints to the constraintsStore.
   *
   * @param {String} url A string represeting a url end-point from which to load the constraints from.
   * @returns {Promise} A promise containing the result of the HTTP request.
   */
  function loadConstraints(url) {
    return $http.get(url).then(function (result) {
      var constraints = result.data;
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
    _.each(_onConstraintsChangedCallbacks, function (callback) {
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
      var index = _onConstraintsChangedCallbacks.indexOf(callback);
      _onConstraintsChangedCallbacks.splice(index, 1);
    }

    _onConstraintsChangedCallbacks.push(callback);

    return deregister;
  }
}]);
//# sourceMappingURL=constraints-store.factory.js.map
;'use strict';

/**
 * @ngdoc service
 * @name jarb-angular-formly.jarbFormlyFieldTransformer
 * @description
 *
 * Transforms a jarb formly and add JaRB validation rules
 * to it.
 */

angular.module('jarb-angular-formly').factory('jarbFormlyFieldTransformer', ["constraintsStore", "jarbRegex", function (constraintsStore, jarbRegex) {
  return { transform: transform };

  /**
   * Takes an array of formly fields and manipulates the
   * templateOptions by adding validation properties based on the
   * JaRB constraints.
   *
   * It looks for the constraints in the constraintsStore by checking
   * if the 'data.jarb' property on the field can be found inside the
   * store. If so it will apply all the JaRB rules it can find.
   *
   * For example given the following constraints:
   *
   * ```JSON
   * {
   *   "Hero": {
   *     "name": {
   *     "javaType": "java.lang.String",
   *     "types": ["text"],
   *     "required": true,
   *     "minimumLength": null,
   *     "maximumLength": 50,
   *     "fractionLength": null,
   *     "radix": null,
   *     "pattern": null,
   *     "min": null,
   *     "max": null,
   *     "name": "name"
   *   }
   * }
   * ```
   *
   * and the following field definition:
   *
   * ```JSON
   * {
   *   id: 'name',
   *   key: 'name',
   *   type: 'input',
   *   data: {
   *     jarb: 'Hero.name'
   *   },
   *   templateOptions: {
   *     type: 'name',
   *     label: 'Name',
   *     placeholder: 'Please enter name of the hero'
   *   }
   * }
   * ```
   *
   * It will transform that field into:
   *
   * ```JSON
   * {
   *   id: 'name',
   *   key: 'name',
   *   type: 'input',
   *   data: {
   *     jarb: 'Hero.name'
   *   },
   *   templateOptions: {
   *     type: 'name',
   *     label: 'Name',
   *     placeholder: 'Please enter name of the hero',
   *     required: true,
   *     maxlength: 0
   *   }
   * }
   * ```
   *
   * @param  {[field]} fields An array of formly fields
   * @param  {model} model the form model
   * @param  {options} options the form options
   * @return {[field]}        A transformed array of formly fields
   */
  function transform(fields, model, options) {
    var constraints = constraintsStore.getConstraints();

    return fields.map(function (field) {
      if (entityNameIsDefined(options) === false) {
        return field;
      }

      var validationKey = options.data.entityName + '.' + field.key;
      var validationRules = validationRulesFor(validationKey, constraints);

      if (validationRules === false) {
        return field;
      }

      if (validationRules.required) {
        _.set(field, 'templateOptions.required', true);
      }

      if (validationRules.minimumLength) {
        _.set(field, 'templateOptions.minlength', validationRules.minimumLength);
      }

      if (validationRules.maximumLength && !isDateOrDateTime(validationRules.javaType)) {
        _.set(field, 'templateOptions.maxlength', validationRules.maximumLength);
      }

      if (validationRules.min) {
        _.set(field, 'templateOptions.min', validationRules.min);
      }

      if (validationRules.max) {
        _.set(field, 'templateOptions.max', validationRules.max);
      }

      var type = mostSpecificInputTypeFor(validationRules.types);
      addPatternAttribute(type, validationRules, field);

      return field;
    });
  }

  /**
   * Returns true if the data.entityName property is defined op the given 'options'.
   * @param options
   * @returns {boolean}
   */
  function entityNameIsDefined(options) {
    var entityName = _.get(options, 'data.entityName');
    return _.isEmpty(entityName) === false;
  }

  /**
   * Finds the validation rules for a specific validator in the
   * constraints object.
   *
   * If no constrains can be found for a validator the boolean false
   * is returned.
   *
   * @param  {validator} 'validator' is a string with the format: 'Class.field' for example: 'User.age'
   * @param  {constraints} The constraints to find the validator in.
   * @throws {error} When the validator doesn't match the format 'className.fieldName'.
   */
  function validationRulesFor(validator, constraints) {
    var parts = validator.split('.');

    var className = parts[0];
    var propertyName = parts[1];

    var classConstraints = constraints[className];

    if (classConstraints) {
      var validationRules = classConstraints[propertyName];

      if (validationRules) {
        return validationRules;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Adds the 'ng-pattern' directive to the element when the type is 'number'.
   *
   * @param {type} The most specific input type for the field
   * @param {validationRules} The validation rules of the given type.
   * @param {field} The <input> type for the element.
   * @param {element} The HTML element which may get a ng-pattern attribute.
   */
  function addPatternAttribute(type, validationRules, field) {
    var pattern = false;

    if (type === 'number' && validationRules.fractionLength > 0) {
      //eslint-disable-line angular/typecheck-number
      pattern = jarbRegex.fractionNumberRegex(validationRules.fractionLength);
    } else if (type === 'number') {
      //eslint-disable-line angular/typecheck-number
      pattern = jarbRegex.numberRegex();
    }

    if (pattern) {
      _.set(field, 'templateOptions.pattern', jarbRegex.convertRegexToFormlyPattern(pattern));
    }
  }

  /**
   * Finds the most specific <input> type for the types parameter. For example if
   * types is ['email', 'text'] the function returns 'email' because 'email'
   * is the most specific input type. If nothing is found returns 'text'.
   *
   * @param  {Array<string>} The types you want the closest type for.
   * @return {string} The closest <input> type, based on the types parameter.
   */
  function mostSpecificInputTypeFor(types) {
    // List of <input> types sorted on most specific first.
    var inputTypes = ['color', 'datetime-local', 'datetime', 'month', 'week', 'date', 'time', 'email', 'tel', 'number', 'url', 'password', 'file', 'image', 'text'];

    for (var i = 0; i < types.length; i += 1) {
      var type = types[i];
      for (var j = 0; j < inputTypes.length; j += 1) {
        var inputType = inputTypes[j];

        if (type === inputType) {
          return type;
        }
      }
    }

    return 'text';
  }

  /**
   * Returns whether or not the given type is a LocalDate or LocalDateTime.
   * If this is the case we need to ignore the maxLength constraints as we communicate these to the backend
   * in a different format than we're saving it in the database.
   * @param type Field type
   * @returns {boolean} true if the type is either a LocalDate or LocalDateTime.
   */
  function isDateOrDateTime(type) {
    return type === 'java.time.LocalDate' || type === 'java.time.LocalDateTime';
  }
}]);
//# sourceMappingURL=jarb-formly-field-transformer.factory.js.map
;'use strict';

/**
 * @ngdoc service
 * @name jarb-angular-formly.jarbRegex
 * @description
 * 
 * Provides regexes to test JaRB input types with.
 */

angular.module('jarb-angular-formly').factory('jarbRegex', function () {
  return { fractionNumberRegex: fractionNumberRegex, numberRegex: numberRegex, convertRegexToFormlyPattern: convertRegexToFormlyPattern };

  /**
   * Returns a regex that checks if the it is a valid number
   * which can have fractions. Which are the numbers behind
   * the decimal. So if the fractionLength is 5 you accept:
   * #.#####, which means 5 numbers after the decimals.
   *
   * The number can be negative or positive.
   *
   * @param  {number} fractionLength The length of the fraction which is considered valid.
   * @return {regex}                 A regex which checks for fraction numbers.
   */
  function fractionNumberRegex(fractionLength) {
    return new RegExp('^-?\\d+(\\.\\d{1,' + fractionLength + '})?$');
  }

  /**
   * Returns a regex which checks for a positive or negative number
   * without fractions.
   *
   * @return {regex} A regex that checks for whole numbers both positive or negative.
   */
  function numberRegex() {
    return (/^-?\d+$/
    );
  }

  /**
   * Takes a regex and transforms that regex into a string which
   * represents the regex in its formly string form.
   *
   * @param  {regex} regex The regex to convert.
   * @return {string}      The resulting formly pattern
   */
  function convertRegexToFormlyPattern(regex) {
    var stringRegex = '' + regex;
    return stringRegex.substring(1, stringRegex.length - 1);
  }
});
//# sourceMappingURL=jarb-regex.factory.js.map
