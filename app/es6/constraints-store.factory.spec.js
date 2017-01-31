'use strict';

describe('Service: constraintsStore', () => {
  beforeEach(module('jarb-angular-formly'));

  // instantiate service
  let constraintsStore;
  let $httpBackend;

  beforeEach(inject(function (_constraintsStore_, _$httpBackend_) {
    constraintsStore = _constraintsStore_;
    $httpBackend = _$httpBackend_;
  }));

  it('should set initial constraints to null', () => {
    expect(constraintsStore.getConstraints()).toBe(null);
  });

  it('should know how to set the constraints', () => {
    // 10 is a faux value for a constraint used for testing.
    constraintsStore.setConstraints(10);

    expect(constraintsStore.getConstraints()).toBe(10);
  });

  it('should call callbacks to the observers when constraints change', () => {
    const observerA = createAndRegisterSpy();
    const observerB = createAndRegisterSpy();

    // 42 is a faux value for a constraint used for testing.
    constraintsStore.setConstraints(42);

    expect(observerA.spy.callback.calls.count()).toBe(1);
    expect(observerA.spy.callback).toHaveBeenCalledWith(42);

    expect(observerB.spy.callback.calls.count()).toBe(1);
    expect(observerB.spy.callback).toHaveBeenCalledWith(42);

    observerA.unregister();

    constraintsStore.setConstraints(43);

    expect(observerA.spy.callback.calls.count()).toBe(1);

    expect(observerB.spy.callback.calls.count()).toBe(2);
    expect(observerB.spy.callback).toHaveBeenCalledWith(43);
  });

  it('should know how to get and set the constraints from the back-end', () => {
    $httpBackend.expectGET('api/constraints').respond('haxors');

    constraintsStore.loadConstraints('api/constraints');
    $httpBackend.flush();

    expect(constraintsStore.getConstraints()).toBe('haxors');
  });

  function createAndRegisterSpy() {
    const spy = { callback: _.noop };
    spyOn(spy, 'callback');

    const unregister = constraintsStore.onConstraintsChanged(spy.callback);

    return { spy, unregister };
  }
});
