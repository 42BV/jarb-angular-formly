# About

[JaRB](http://www.jarbframework.org/) JaRB aims to improve database 
usage in Java enterprise applications. With JaRB you can get the
validation rules from the database into Java. With this project
you can get those rules into your Angular 1.x [formly](http://docs.angular-formly.com/) 
forms as well. 

# Installation

Bower: `bower install jarb-angular-formly --save`
NPM: `npm install jarb-angular-formly --save`

# Preparation

First in your Java project make sure jarb-angular-formly can read
the contraints, via a GET request:

```Java
// EntityConstraintsController.java

@RestController
@RequestMapping("/constraints")
class EntityConstraintsController {
    private final BeanConstraintService beanConstraintService;

    @Autowired
    SystemConstraintsController(BeanConstraintDescriptor beanConstraintDescriptor) {
        beanConstraintService = new BeanConstraintService(beanConstraintDescriptor);
        beanConstraintService.registerAllWithAnnotation(Application.class, Entity.class);
    }

    @RequestMapping(method = RequestMethod.GET)
    Map<String, Map<String, PropertyConstraintDescription>> describeAll() {
        return beanConstraintService.describeAll();
    }
}
```

# Usage

Now in your dependencies add 'jarb-angular-formly' when you register
your module. For example:

```JavaScript
angular
  .module('yourApp', [
    'formly',
    'jarb-angular-formly'
  ]);
```

Next tell `formly` to use `jarb-angular-formly`:

```JavaScript
'use strict';

/**
 * @ngdoc run
 * @description
 * Wraps all formly-bootstrap templates with a ng-messages
 * so the error messages are displayed to the user.
 *
 * Also adds the jarb field transformer to automatically add
 * validation rules.
 */
angular.module('yourApp')
  .run(function (formlyConfig, jarbFormlyFieldTransformer) {
    formlyConfig.extras.fieldTransform.push(jarbFormlyFieldTransformer.transform);
  });
```

Now in your front-end angular project make sure you include:
`jarb-angular-formly.min.js`. Next you need to load the constraints
from the Java back-end:

```JavaScript
angular.module('yourModule')
  .run(function(constraintsStore) {
    constraintsStore.loadConstraints('api/constraints');
  });
```

If you lock your constraints behind a login you should load the constraints
as soon as the user is logged in.

Now when you define a field with the options in formly like this:

```JavaScript
const formlyFields = [{
  id: 'name',
  key: 'name',
  type: 'input',
  templateOptions: {
    type: 'text',
    label: 'Hero name',
    placeholder: 'Please enter the name of the hero'
  }
}];

const formlyOptions = {
  data: {
    entityName: 'Hero'
  }
};
```

It will apply the constraints from `Hero.name`, because the key is 'name'
and the entityName is 'Hero'.

## Ignoring fields

Sometimes you want to ignore certain fields, you can do this by defining
a special key in the data called 'ignoreJarbConstraints' like so:

```JavaScript
const formlyFields = [{
  id: 'age',
  key: 'age',
  type: 'input',
  data: {
    ignoreJarbConstraints: true
  },
  templateOptions: {
    type: 'number',
    label: 'Hero age',
    placeholder: 'Please enter the age of the hero'
  }
}];
```
