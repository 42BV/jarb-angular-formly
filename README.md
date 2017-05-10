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
