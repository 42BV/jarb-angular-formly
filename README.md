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

    private final EntityConstraintsService constraintsService;

    @Autowired
    EntityConstraintsController(EntityConstraintsService constraintsService) {
        this.constraintsService = constraintsService;
    }

    @RequestMapping(method = RequestMethod.GET)
    Map<String, Map<String, PropertyConstraintDescription>> describeAll() {
        return constraintsService.getAll();
    }

}
```

Next we need to define the EntityConstraintsService:

```Java
// EntityConstraintsService.java

@Service
class EntityConstraintsService {

    // The properties we don't want to expose via the API because they are useless.
    private static final List<String> IGNORED_PROPERTIES = Arrays.asList("new", "id", "class");

    private final BeanConstraintDescriptor beanConstraintDescriptor;

    @Autowired
    EntityConstraintsService(BeanConstraintDescriptor beanConstraintDescriptor) {
        this.beanConstraintDescriptor = beanConstraintDescriptor;
    }

    Map<String, Map<String, PropertyConstraintDescription>> getAll() {
        Map<String, Map<String, PropertyConstraintDescription>> descriptions = new HashMap<>();
        Set<Class<?>> entityClasses = ClassScanner.getAllWithAnnotation(Application.class.getPackage().getName(), Entity.class);
        for (Class<?> entityClass : entityClasses) {
            String entityName = entityClass.getSimpleName();

            BeanConstraintDescription description = beanConstraintDescriptor.describeBean(entityClass);
            Map<String, PropertyConstraintDescription> properties = new HashMap<>(description.getProperties());
            IGNORED_PROPERTIES.forEach(properties::remove);

            descriptions.put(entityName, properties);
        }

        return descriptions;
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
