import Graph from './Graph';

export default class Edge extends Graph {
  constructor(props, options) {
    super(props, options);

    this.methods.from = function from(...args) {
      if (args.length) {
        this._from = args[0];
        return this;
      }

      return this._from;
    };

    this.methods.to = function to(...args) {
      if (args.length) {
        this._to = args[0];
        return this;
      }

      return this._to;
    };
  }
}
