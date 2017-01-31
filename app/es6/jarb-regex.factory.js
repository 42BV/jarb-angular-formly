'use strict';

/**
 * @ngdoc service
 * @name jarb-angular-formly.jarbRegex
 * @description
 * 
 * Provides regexes to test JaRB input types with.
 */
angular.module('jarb-angular-formly')
  .factory('jarbRegex', function() {
    return { fractionNumberRegex, numberRegex, convertRegexToFormlyPattern };

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
      return /^-?\d+$/;
    }

    /**
     * Takes a regex and transforms that regex into a string which
     * represents the regex in its formly string form.
     *
     * @param  {regex} regex The regex to convert.
     * @return {string}      The resulting formly pattern
     */
    function convertRegexToFormlyPattern(regex) {
      const stringRegex = '' + regex;
      return stringRegex.substring(1, stringRegex.length - 1);
    }
  });
