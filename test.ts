import {IComponentController, IScope, element, mock} from 'angular'
import {$compile, $rootScope} from 'ngimport'
import NgComponent from './'

interface Props {
  a: number
  b: string
}

describe('Component', () => {

  describe('#$onChanges', () => {
    it('should call #render if any prop has changed', () => {
      class A extends NgComponent<Props, {}> {
        render() {}
      }
      const a = new A
      const spy = spyOn(a, 'render')

      // call #1
      a.$onChanges({
        a: {currentValue: 42, previousValue: undefined, isFirstChange: () => true},
        b: {currentValue: undefined, previousValue: undefined, isFirstChange: () => true}
      })
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: 42, b: undefined })

      // call #2
      a.$onChanges({
        a: {currentValue: 60, previousValue: 42, isFirstChange: () => false},
        b: {currentValue: 'foo', previousValue: undefined, isFirstChange: () => false}
      })
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: 60, b: 'foo' })

      // call #3
      a.$onChanges({
        b: {currentValue: 'bar', previousValue: 'foo', isFirstChange: () => false}
      })
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: 60, b: 'bar' })

      // call #4
      a.$onChanges({
        a: {currentValue: -10, previousValue: 60, isFirstChange: () => false}
      })
      expect(spy.calls.mostRecent().args[0])
        .toEqual({ a: -10, b: 'bar' })
    })
    it('should not call #render if no props have changed', () => {
      class A extends NgComponent<Props, {}> {
        render() {}
      }
      const a = new A
      const spy = spyOn(a, 'render')

      // call #1
      a.$onChanges({
        a: { currentValue: 42, previousValue: undefined, isFirstChange: () => true },
        b: { currentValue: undefined, previousValue: undefined, isFirstChange: () => true }
      })
      expect(spy.calls.count()).toBe(1)

      // call #2
      a.$onChanges({
        a: { currentValue: 42, previousValue: 42, isFirstChange: () => false },
        b: { currentValue: undefined, previousValue: undefined, isFirstChange: () => false }
      })
      expect(spy.calls.count()).toBe(1)

    })
  })

  describe('lifecycle hooks', () => {

    describe('#componentWillMount', () => {
      it('should get called when the component mounts', () => {
        class A extends NgComponent<Props, {}> {
          render() {}
        }
        const spy = spyOn(A.prototype, 'componentWillMount')
        renderComponent(A)
        expect(spy).toHaveBeenCalledWith()
      })
    })

    describe('#componentDidMount', () => {
      it('should get called when the component mounts', () => {
        class A extends NgComponent<Props, {}> {
          render() {}
        }
        const spy = spyOn(A.prototype, 'componentDidMount')
        renderComponent(A)
        expect(spy).toHaveBeenCalledWith()
      })
    })

    describe('#componentWillReceiveProps', () => {
      it('should not get called on initial render', () => {
        class A extends NgComponent<Props, {}> {
          render() {}
        }
        const spy = spyOn(A.prototype, 'componentWillReceiveProps')
        renderComponent(A)
        expect(spy).not.toHaveBeenCalled()
      })
      it('should get called when props update', () => {
        class A extends NgComponent<Props, {}> {
          render() { }
          componentWillReceiveProps(props: Props) {}
        }
        const {parentScope, scope} = renderComponent(A)
        const spy = spyOn(scope.$ctrl, 'componentWillReceiveProps')
        parentScope.$apply(() => parentScope.a = 20)
        expect(spy).toHaveBeenCalledWith({ a: 20 })
      })
    })

    describe('#shouldComponentUpdate', () => {
      it('should not get called on the initial render', () => {
        class A extends NgComponent<Props, {}> {
          render() {}
        }
        const spy = spyOn(A.prototype, 'shouldComponentUpdate')
        const a = new A
        expect(spy).not.toHaveBeenCalled()
      })
      it('should get called on subsequent renders', () => {
        class A extends NgComponent<Props, {}> {
          render() {}
        }
        const spy = spyOn(A.prototype, 'shouldComponentUpdate')
        const a = new A
        a.$onChanges({
          a: { currentValue: 42, previousValue: 10, isFirstChange: () => true },
          b: { currentValue: 'foo', previousValue: undefined, isFirstChange: () => true }
        })
        expect(spy).toHaveBeenCalledWith({a: 42, b: 'foo'}, {a: 10, b: undefined})
      })
      it('should accept a custom comparator', () => {
        class A extends NgComponent<Props, {}> {
          render() {}
          shouldComponentUpdate(newProps: Props, oldProps: Props): boolean {
            return newProps.a > oldProps.a
          }
        }
        const a = new A
        const spy = spyOn(a, 'render')

        // call #1
        a.$onChanges({
          a: { currentValue: 42, previousValue: 10, isFirstChange: () => true },
          b: { currentValue: 'foo', previousValue: undefined, isFirstChange: () => true }
        })
        expect(spy.calls.count()).toBe(1)
        expect(spy.calls.mostRecent().args[0])
          .toEqual({ a: 42, b: 'foo' })

        // call #2
        a.$onChanges({
          a: { currentValue: 30, previousValue: 42, isFirstChange: () => true },
          b: { currentValue: 'bar', previousValue: 'foo', isFirstChange: () => true }
        })
        expect(spy.calls.count()).toBe(1)

        // call #3
        a.$onChanges({
          a: { currentValue: 31, previousValue: 30, isFirstChange: () => true },
          b: { currentValue: 'bar', previousValue: 'foo', isFirstChange: () => true }
        })
        expect(spy.calls.count()).toBe(2)
        expect(spy.calls.mostRecent().args[0])
          .toEqual({ a: 31, b: 'bar' })
      })
    })

    describe('#componentWillUpdate', () => {
      it('should not get called on initial render', () => {
        class A extends NgComponent<Props, {}> {
          render() {}
        }
        const spy = spyOn(A.prototype, 'componentWillUpdate')
        renderComponent(A)
        expect(spy).not.toHaveBeenCalled()
      })
      it('should get called before the component renders', () => {
        class A extends NgComponent<Props, {}> {
          render() { }
          componentWillUpdate(props: Props) {}
        }
        const {parentScope, scope} = renderComponent(A)
        const spy = spyOn(scope.$ctrl, 'componentWillUpdate')
        parentScope.$apply(() => parentScope.a = 20)
        expect(spy).toHaveBeenCalledWith({ a: 20, b: 'foo' }, undefined)
      })
    })

    describe('#componentDidUpdate', () => {
      it('should not get called on initial render', () => {
        class A extends NgComponent<Props, {}> {
          render() {}
        }
        const spy = spyOn(A.prototype, 'componentDidUpdate')
        renderComponent(A)
        expect(spy).not.toHaveBeenCalled()
      })
      it('should get called after the component renders', () => {
        class A extends NgComponent<Props, {}> {
          render() { }
          componentDidUpdate(props: Props) {}
        }
        const {parentScope, scope} = renderComponent(A)
        const spy = spyOn(scope.$ctrl, 'componentDidUpdate')
        parentScope.$apply(() => parentScope.a = 20)
        expect(spy).toHaveBeenCalledWith({ a: 20, b: 'foo' }, undefined)
      })
    })

    describe('#componentWillUnmount', () => {
      it('should get called when the component unmounts', () => {
        class A extends NgComponent<Props, {}> {
          render() { }
          componentWillUnmount() { }
        }
        const {parentScope, scope} = renderComponent(A)
        const spy = spyOn(scope.$ctrl, 'componentWillUnmount')
        parentScope.$destroy()
        expect(spy).toHaveBeenCalledWith()
      })
    })

  })
})

// helpers

interface Scope extends IScope {
  a: number
  b: string
  $ctrl: NgComponent<Props, void>
}

function renderComponent(controller: IComponentController) {
  angular
    .module('test', ['bcherny/ngimport'])
    .component('myComponent', {
      bindings: {
        a: '<',
        b: '<'
      },
      controller,
      template: `{{a}}`
    })

  angular
    .bootstrap(element(), ['test'])

  const el = element('<my-component a="a" b="b"></my-component>')
  const parentScope = Object.assign($rootScope.$new(true), {
    a: 10,
    b: 'foo'
  })
  $compile(el)(parentScope)
  parentScope.$apply()
  const scope: Scope = el.isolateScope()
  return {
    parentScope,
    scope
  }
}