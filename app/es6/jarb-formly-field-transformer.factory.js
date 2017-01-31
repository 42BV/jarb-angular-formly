'use strict';

/**
 * @ngdoc service
 * @name jarb-angular-formly.jarbFormlyFieldTransformer
 * @description
 *
 * Transforms a jarb formly and add JaRB validation rules
 * to it.
 */
angular.module('jarb-angular-formly')
  .factory('jarbFormlyFieldTransformer', function(constraintsStore, jarbRegex) {
    return { transform };

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
      let constraints = constraintsStore.getConstraints();

      return fields.map((field) => {
        if (entityNameIsDefined(options) === false) {
          return field;
        }

        const validationKey = `${options.data.entityName}.${field.key}`;
        const validationRules = validationRulesFor(validationKey, constraints);

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

        const type = mostSpecificInputTypeFor(validationRules.types);
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
      const entityName = _.get(options, 'data.entityName');
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

      if (type === 'number' && validationRules.fractionLength > 0) { //eslint-disable-line angular/typecheck-number
        pattern = jarbRegex.fractionNumberRegex(validationRules.fractionLength);
      } else if (type === 'number') { //eslint-disable-line angular/typecheck-number
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
      const inputTypes = ['color', 'datetime-local', 'datetime', 'month', 'week', 'date', 'time', 'email', 'tel', 'number', 'url', 'password', 'file', 'image', 'text'];

      for (let i = 0; i < types.length; i += 1) {
        const type = types[i];
        for (let j = 0; j < inputTypes.length; j += 1) {
          const inputType = inputTypes[j];

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
  });
