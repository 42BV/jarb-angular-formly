'use strict';

describe('Service: jarbFormlyFieldTransformer', function () {
  beforeEach(module('jarb-angular-formly'));

  // instantiate service
  let jarbFormlyFieldTransformer;
  let constraintsStore;

  let entityNameOptions;

  beforeEach(inject(function (_jarbFormlyFieldTransformer_, _constraintsStore_) {
    jarbFormlyFieldTransformer = _jarbFormlyFieldTransformer_;
    constraintsStore = _constraintsStore_;

    const constraints = {
      "Hero": {
        "name": {
          "javaType": "java.lang.String",
          "types": [], // Empty array on purpose so it will default to 'text'
          "required": true,
          "minimumLength": 5,
          "maximumLength": 50,
          "fractionLength": null,
          "radix": null,
          "pattern": null,
          "min": null,
          "max": null,
          "name": "name"
        },
        "age": {
          "javaType": "java.lang.Integer",
          "types": ["number"],
          "required": null,
          "minimumLength": null,
          "maximumLength": null,
          "fractionLength": null,
          "radix": null,
          "pattern": null,
          "min": null,
          "max": null,
          "name": "age"
        },
        "favoriteNumber": {
          "javaType": "java.lang.Integer",
          "types": ["number"],
          "required": null,
          "minimumLength": null,
          "maximumLength": null,
          "fractionLength": null,
          "radix": null,
          "pattern": null,
          "min": 42,
          "max": 1337,
          "name": "favoriteNumber"
        },
        "salary": {
          "javaType": "java.lang.Integer",
          "types": ["number"],
          "required": null,
          "minimumLength": null,
          "maximumLength": null,
          "fractionLength": 4,
          "radix": null,
          "pattern": null,
          "min": null,
          "max": null,
          "name": "password"
        },
        // In the cases of LocalDates or LocalDateTimes we should ignore the maximumLength
        birthDate: {
          javaType: "java.time.LocalDate",
          "types": ["date"],
          maximumLength: 8
        },
        deathTime: {
          javaType: "java.time.LocalDateTime",
          "types": ["date"],
          maximumLength: 14
        }
      }
    };

    // We create an options object with a data.entityName property in it on which we set the entity name.
    entityNameOptions = {
      data: {
        entityName: "Hero"
      }
    };

    spyOn(constraintsStore, 'getConstraints').and.returnValue(constraints);

  }));

  it('should know how to add a maxlength, minlength and required', () => {
    const formlyFields = [{
      id: 'name',
      key: 'name',
      type: 'input',
      templateOptions: {
        type: 'name',
        label: 'Name',
        placeholder: 'Please enter name of the hero'
      }
    }];

    const expected = [{
      id: 'name',
      key: 'name',
      type: 'input',
      templateOptions: {
        type: 'name',
        label: 'Name',
        placeholder: 'Please enter name of the hero',
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }];

    expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
  });


  it('should know how to add min and max', () => {
    const formlyFields = [{
      id: 'favoriteNumber',
      key: 'favoriteNumber',
      type: 'input',
      templateOptions: {
        type: 'number',
        label: 'Favorite number',
        placeholder: 'Please enter the favorite number of the hero'
      }
    }];

    const expected = [{
      id: 'favoriteNumber',
      key: 'favoriteNumber',
      type: 'input',
      templateOptions: {
        type: 'number',
        label: 'Favorite number',
        placeholder: 'Please enter the favorite number of the hero',
        min: 42,
        max: 1337,
        pattern: '^-?\\d+$'
      }
    }];

    expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
  });

  describe('number patterns', () => {
    it('should know how to add number regex', () => {
      const formlyFields = [{
        id: 'salary',
        key: 'salary',
        type: 'input',
        templateOptions: {
          type: 'salary',
          label: 'Salary',
          placeholder: 'Please enter salary of the hero'
        }
      }];

      const expected = [{
        id: 'salary',
        key: 'salary',
        type: 'input',
        templateOptions: {
          type: 'salary',
          label: 'Salary',
          placeholder: 'Please enter salary of the hero',
          pattern: '^-?\\d+(\\.\\d{1,4})?$'
        }
      }];

      expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
    });

    it('should know how to add a number regex with an fraction', () => {
      const formlyFields = [{
        id: 'age',
        key: 'age',
        type: 'input',
        templateOptions: {
          type: 'age',
          label: 'Age',
          placeholder: 'Please enter age of the hero'
        }
      }];

      const expected = [{
        id: 'age',
        key: 'age',
        type: 'input',
        templateOptions: {
          type: 'age',
          label: 'Age',
          placeholder: 'Please enter age of the hero',
          pattern: '^-?\\d+$'
        }
      }];

      expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
    });
  });

  describe('when jarb validator does not exist', () => {
    it('should not change the field when "data" is not present', () => {
      entityNameOptions = {};

      const formlyFields = [{
        id: 'name',
        key: 'name',
        type: 'input',
        templateOptions: {
          type: 'name',
          label: 'Name',
          placeholder: 'Please enter name of the hero'
        }
      }];

      const expected = angular.copy(formlyFields);
      expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
    });

    it('should not change the field when a validator is present but class cannot be found', () => {
      entityNameOptions.data.entityName = "Villain";

      const formlyFields = [{
        id: 'name',
        key: 'name',
        type: 'input',
        templateOptions: {
          type: 'name',
          label: 'Name',
          placeholder: 'Please enter name of the villain'
        }
      }];

      const expected = angular.copy(formlyFields);
      expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
    });

    it('should not change the field when a validator is present but rules cannot be found', () => {
      const formlyFields = [{
        id: 'superpower',
        key: 'superpower',
        type: 'input',
        templateOptions: {
          type: 'name',
          label: 'Superpower',
          placeholder: 'Please enter the super power of the hero'
        }
      }];

      const expected = angular.copy(formlyFields);
      expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
    });
  });

  it('should should not add maxLengths on LocalDates', () => {
    const formlyFields = [{
      id: 'birthDate',
      key: 'birthDate',
      type: 'date',
      templateOptions: {
        type: 'birthDate',
        label: 'birthDate',
        placeholder: 'Please enter date of birth of the hero'
      }
    }];

    const expected = [{
      id: 'birthDate',
      key: 'birthDate',
      type: 'date',
      templateOptions: {
        type: 'birthDate',
        label: 'birthDate',
        placeholder: 'Please enter date of birth of the hero'
      }
    }];

    expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
  });

  it('should should not add maxLengths on LocalDateTimes', () => {
    const formlyFields = [{
      id: 'deathTime',
      key: 'deathTime',
      type: 'date',
      templateOptions: {
        type: 'deathTime',
        label: 'deathTime',
        hasTime: true,
        placeholder: 'Please enter time of death of the hero'
      }
    }];

    const expected = [{
      id: 'deathTime',
      key: 'deathTime',
      type: 'date',
      templateOptions: {
        type: 'deathTime',
        label: 'deathTime',
        hasTime: true,
        placeholder: 'Please enter time of death of the hero'
      }
    }];

    expect(jarbFormlyFieldTransformer.transform(formlyFields, null, entityNameOptions)).toEqual(expected);
  });
});
