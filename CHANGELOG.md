## 1.2.0 (2017-05-10)
Added support for @Embeddable fields in an @Entity.

Updated the README with new instructions on how to configure the back-end. 

## 1.1.0 (2017-02-10)
Changed the 'minlength' and 'maxlength' behavior.

Before the minlength and maxlength behavior was applied whenever it
was found on the contraints. Now it is only applied when the javaType
is a Java.lang.String.

This way the properties will not be set unintentionally.

## 1.0.0 (2017-01-31)
Initial version