class NgComponent {
    constructor() {
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
    $onChanges(changes) {
        const oldProps = clone(changes);
        const newProps = clone(changes);
        const changeKeys = Object.getOwnPropertyNames(changes);
        let didPropsChange = false;
        for (let i = 0; i < changeKeys.length; ++i) {
            const key = changeKeys[i];
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
        const nextProps = Object.assign({}, this.props, newProps);
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
            const shouldUpdate = this.shouldComponentUpdate(nextProps, this.state);
            this.props = nextProps;
            if (!shouldUpdate)
                return;
            this.componentWillUpdate(this.props, this.state);
            this.render();
            this.componentDidUpdate(this.props, this.state);
        }
    }
    $postLink() {
        this.componentDidMount();
    }
    $onDestroy() {
        this.componentWillUnmount();
    }
    /*
      lifecycle hooks
    */
    componentWillMount() { }
    componentDidMount() { }
    componentWillReceiveProps(props) { }
    shouldComponentUpdate(nextProps, nextState) { return true; }
    componentWillUpdate(props, state) { }
    componentDidUpdate(props, state) { }
    componentWillUnmount() { }
    render() { }
}
function clone(t) {
    return JSON.parse(JSON.stringify(t));
}
export default NgComponent;
