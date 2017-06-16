"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var NgComponent = (function () {
    function NgComponent() {
        this.__isFirstRender = true;
        this.state = {};
        this.props = {};
    }
    /*
      eg. {
        as: {currentValue: [1, 2, 3], previousValue: [1, 2]},
        bs: {currentValue: 42, previousValue: undefined}
      }
    */
    // nb: this method is explicity exposed for unit testing
    NgComponent.prototype.$onChanges = function (changes) {
        var oldProps = clone(changes);
        var newProps = clone(changes);
        var changeKeys = Object.getOwnPropertyNames(changes);
        var didPropsChange = false;
        for (var i = 0; i < changeKeys.length; ++i) {
            var key = changeKeys[i];
            try {
                oldProps[key] = oldProps[key]['previousValue'];
            }
            catch (e) { }
            try {
                newProps[key] = newProps[key]['currentValue'];
            }
            catch (e) { }
            didPropsChange = didPropsChange || (newProps[key] !== oldProps[key]);
        }
        var nextProps = __assign({}, this.props, newProps);
        // TODO: implement nextState (which also means implement this.setState)
        if (this.__isFirstRender) {
            this.props = nextProps;
            this.componentWillMount();
            this.render();
            this.__isFirstRender = false;
        }
        else {
            if (!didPropsChange)
                return;
            this.componentWillReceiveProps(nextProps);
            var shouldUpdate = this.shouldComponentUpdate(nextProps, this.state);
            this.props = nextProps;
            if (!shouldUpdate)
                return;
            this.componentWillUpdate(this.props, this.state);
            this.render();
            this.componentDidUpdate(this.props, this.state);
        }
    };
    NgComponent.prototype.$postLink = function () {
        this.componentDidMount();
    };
    NgComponent.prototype.$onDestroy = function () {
        this.componentWillUnmount();
    };
    /*
      lifecycle hooks
    */
    NgComponent.prototype.componentWillMount = function () { };
    NgComponent.prototype.componentDidMount = function () { };
    NgComponent.prototype.componentWillReceiveProps = function (props) { };
    NgComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) { return true; };
    NgComponent.prototype.componentWillUpdate = function (props, state) { };
    NgComponent.prototype.componentDidUpdate = function (props, state) { };
    NgComponent.prototype.componentWillUnmount = function () { };
    NgComponent.prototype.render = function () { };
    return NgComponent;
}());
function clone(t) {
    return JSON.parse(JSON.stringify(t));
}
exports.default = NgComponent;
