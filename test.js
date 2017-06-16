"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var angular_1 = require("angular");
var lodash_1 = require("lodash");
var ngimport_1 = require("ngimport");
var _1 = require("./");
describe('Component', function () {
    describe('#$onChanges', function () {
        it('should call #render if any prop has changed', function () {
            var A = (function (_super) {
                __extends(A, _super);
                function A() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                A.prototype.render = function () { };
                return A;
            }(_1.default));
            var a = new A;
            // call #1
            a.$onChanges({
                a: { currentValue: 42, previousValue: undefined, isFirstChange: function () { return true; } },
                b: { currentValue: undefined, previousValue: undefined, isFirstChange: function () { return true; } }
            });
            expect(a.props).toEqual({ a: 42, b: undefined });
            // call #2
            a.$onChanges({
                a: { currentValue: 60, previousValue: 42, isFirstChange: function () { return false; } },
                b: { currentValue: 'foo', previousValue: undefined, isFirstChange: function () { return false; } }
            });
            expect(a.props).toEqual({ a: 60, b: 'foo' });
            // call #3
            a.$onChanges({
                b: { currentValue: 'bar', previousValue: 'foo', isFirstChange: function () { return false; } }
            });
            expect(a.props).toEqual({ a: 60, b: 'bar' });
            // call #4
            a.$onChanges({
                a: { currentValue: -10, previousValue: 60, isFirstChange: function () { return false; } }
            });
            expect(a.props).toEqual({ a: -10, b: 'bar' });
        });
        it('should not call #render if no props have changed', function () {
            var counter = 0;
            var A = (function (_super) {
                __extends(A, _super);
                function A() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                A.prototype.render = function () { counter++; };
                return A;
            }(_1.default));
            var a = new A;
            // call #1
            a.$onChanges({
                a: { currentValue: 42, previousValue: undefined, isFirstChange: function () { return true; } },
                b: { currentValue: undefined, previousValue: undefined, isFirstChange: function () { return true; } }
            });
            expect(counter).toBe(1);
            // call #2
            a.$onChanges({
                a: { currentValue: 42, previousValue: 42, isFirstChange: function () { return false; } },
                b: { currentValue: undefined, previousValue: undefined, isFirstChange: function () { return false; } }
            });
            expect(counter).toBe(1);
        });
    });
    describe('lifecycle hooks', function () {
        describe('#componentWillMount', function () {
            it('should get called when the component mounts', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    return A;
                }(_1.default));
                var spy = spyOn(A.prototype, 'componentWillMount');
                renderComponent(A);
                expect(spy).toHaveBeenCalledWith();
            });
        });
        describe('#componentDidMount', function () {
            it('should get called when the component mounts', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    return A;
                }(_1.default));
                var spy = spyOn(A.prototype, 'componentDidMount');
                renderComponent(A);
                expect(spy).toHaveBeenCalledWith();
            });
        });
        describe('#componentWillReceiveProps', function () {
            it('should not get called on initial render', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    return A;
                }(_1.default));
                var spy = spyOn(A.prototype, 'componentWillReceiveProps');
                renderComponent(A);
                expect(spy).not.toHaveBeenCalled();
            });
            it('should get called when props update', function (done) {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    A.prototype.componentWillReceiveProps = function (props) {
                        expect(props).toEqual({ a: 20, b: 'foo' });
                        expect(this.props).not.toEqual(props);
                        done();
                    };
                    return A;
                }(_1.default));
                var _a = renderComponent(A), parentScope = _a.parentScope, scope = _a.scope;
                parentScope.$apply(function () { return parentScope.a = 20; });
            });
        });
        describe('#shouldComponentUpdate', function () {
            it('should not get called on the initial render', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    return A;
                }(_1.default));
                var spy = spyOn(A.prototype, 'shouldComponentUpdate');
                // tslint:disable-next-line:no-unused-variable
                var a = new A;
                a.$onChanges({
                    a: { currentValue: 42, previousValue: 10, isFirstChange: function () { return true; } },
                    b: { currentValue: 'foo', previousValue: undefined, isFirstChange: function () { return true; } }
                });
                expect(spy).not.toHaveBeenCalled();
            });
            it('should render even if false on initial render', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.shouldComponentUpdate = function () {
                        return false;
                    };
                    A.prototype.render = function () { };
                    return A;
                }(_1.default));
                var spy = spyOn(A.prototype, 'render');
                // tslint:disable-next-line:no-unused-variable
                var a = new A;
                a.$onChanges({
                    a: { currentValue: 42, previousValue: 10, isFirstChange: function () { return true; } },
                    b: { currentValue: 'foo', previousValue: undefined, isFirstChange: function () { return true; } }
                });
                expect(spy).toHaveBeenCalled();
            });
            it('should get called on subsequent renders', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        var _this = _super.call(this) || this;
                        _this.state = { c: false };
                        return _this;
                    }
                    A.prototype.render = function () { };
                    return A;
                }(_1.default));
                var spy = spyOn(A.prototype, 'shouldComponentUpdate');
                var a = new A;
                // first render
                a.$onChanges({
                    a: { currentValue: 10, previousValue: undefined, isFirstChange: function () { return true; } },
                    b: { currentValue: undefined, previousValue: undefined, isFirstChange: function () { return true; } }
                });
                // subsequent render
                a.$onChanges({
                    a: { currentValue: 42, previousValue: 10, isFirstChange: function () { return true; } },
                    b: { currentValue: 'foo', previousValue: undefined, isFirstChange: function () { return true; } }
                });
                expect(spy).toHaveBeenCalledWith({ a: 42, b: 'foo' }, { c: false });
            });
            it('should accept a custom comparator', function () {
                var counter = 0;
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { counter++; };
                    A.prototype.shouldComponentUpdate = function (nextProps) {
                        return nextProps.a > this.props.a;
                    };
                    return A;
                }(_1.default));
                var a = new A;
                // call #1
                a.$onChanges({
                    a: { currentValue: 42, previousValue: 10, isFirstChange: function () { return true; } },
                    b: { currentValue: 'foo', previousValue: undefined, isFirstChange: function () { return true; } }
                });
                expect(counter).toBe(1);
                expect(a.props).toEqual({ a: 42, b: 'foo' });
                // call #2
                a.$onChanges({
                    a: { currentValue: 30, previousValue: 42, isFirstChange: function () { return true; } },
                    b: { currentValue: 'bar', previousValue: 'foo', isFirstChange: function () { return true; } }
                });
                expect(counter).toBe(1);
                // call #3
                a.$onChanges({
                    a: { currentValue: 31, previousValue: 30, isFirstChange: function () { return true; } },
                    b: { currentValue: 'bar', previousValue: 'foo', isFirstChange: function () { return true; } }
                });
                expect(counter).toBe(2);
                expect(a.props).toEqual({ a: 31, b: 'bar' });
            });
        });
        describe('#componentWillUpdate', function () {
            it('should not get called on initial render', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    return A;
                }(_1.default));
                var spy = spyOn(A.prototype, 'componentWillUpdate');
                renderComponent(A);
                expect(spy).not.toHaveBeenCalled();
            });
            it('should get called before the component renders', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    A.prototype.componentWillUpdate = function (props) { };
                    return A;
                }(_1.default));
                var _a = renderComponent(A), parentScope = _a.parentScope, scope = _a.scope;
                var spy = spyOn(scope.$ctrl, 'componentWillUpdate');
                parentScope.$apply(function () { return parentScope.a = 20; });
                expect(spy).toHaveBeenCalledWith({ a: 20, b: 'foo' }, {});
            });
        });
        describe('#componentDidUpdate', function () {
            it('should not get called on initial render', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    return A;
                }(_1.default));
                var spy = spyOn(A.prototype, 'componentDidUpdate');
                renderComponent(A);
                expect(spy).not.toHaveBeenCalled();
            });
            it('should get called after the component renders', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    A.prototype.componentDidUpdate = function (props) { };
                    return A;
                }(_1.default));
                var _a = renderComponent(A), parentScope = _a.parentScope, scope = _a.scope;
                var spy = spyOn(scope.$ctrl, 'componentDidUpdate');
                parentScope.$apply(function () { return parentScope.a = 20; });
                expect(spy).toHaveBeenCalledWith({ a: 20, b: 'foo' }, {});
            });
        });
        describe('#componentWillUnmount', function () {
            it('should get called when the component unmounts', function () {
                var A = (function (_super) {
                    __extends(A, _super);
                    function A() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    A.prototype.render = function () { };
                    A.prototype.componentWillUnmount = function () { };
                    return A;
                }(_1.default));
                var _a = renderComponent(A), parentScope = _a.parentScope, scope = _a.scope;
                var spy = spyOn(scope.$ctrl, 'componentWillUnmount');
                parentScope.$destroy();
                expect(spy).toHaveBeenCalledWith();
            });
        });
    });
    describe('overall lifecycle', function () {
        it('should be called in correct order', function () {
            var events = [];
            var A = (function (_super) {
                __extends(A, _super);
                function A() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                A.prototype.componentWillMount = function () {
                    events.push('componentWillMount');
                };
                A.prototype.componentDidMount = function () {
                    events.push('componentDidMount');
                };
                A.prototype.shouldComponentUpdate = function (nextProps) {
                    events.push('shouldComponentUpdate');
                    return nextProps.a === 42;
                };
                A.prototype.componentWillUpdate = function () {
                    events.push('componentWillUpdate');
                };
                A.prototype.render = function () {
                    events.push('render');
                };
                A.prototype.componentDidUpdate = function () {
                    events.push('componentDidUpdate');
                };
                A.prototype.componentWillUnmount = function () {
                    events.push('componentWillUnmount');
                };
                return A;
            }(_1.default));
            var _a = renderComponent(A), parentScope = _a.parentScope, scope = _a.scope;
            parentScope.$apply(function () { return parentScope.a = 42; }); // update
            parentScope.$apply(function () { return parentScope.a = 21; }); // no update
            parentScope.$destroy();
            expect(events).toEqual([
                'componentWillMount',
                'render',
                'componentDidMount',
                'shouldComponentUpdate',
                'componentWillUpdate',
                'render',
                'componentDidUpdate',
                'shouldComponentUpdate',
                'componentWillUnmount'
            ]);
        });
    });
});
function renderComponent(controller) {
    angular_1.module('test', ['bcherny/ngimport'])
        .component('myComponent', {
        bindings: {
            a: '<',
            b: '<'
        },
        controller: controller,
        template: "{{a}}"
    });
    angular_1.bootstrap(angular_1.element(), ['test']);
    var el = angular_1.element('<my-component a="a" b="b"></my-component>');
    var parentScope = lodash_1.assign(ngimport_1.$rootScope.$new(true), {
        a: 10,
        b: 'foo'
    });
    ngimport_1.$compile(el)(parentScope);
    parentScope.$apply();
    var scope = el.isolateScope();
    return {
        parentScope: parentScope,
        scope: scope
    };
}
