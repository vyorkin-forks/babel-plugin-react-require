'use strict';

const babel = require('babel-core');
const assert = require('assert');
let reactPlugin;
let transform;

try {
  reactPlugin = require('../lib-cov/index').default;
} catch (error) {
  reactPlugin = require('../src/index').default;
}

describe('babel-plugin-react', () => {
  beforeEach(() => {
    transform = (code) => {
      return babel.transform(code, {
        plugins: ['syntax-jsx', reactPlugin],
      }).code;
    };
  });

  it('should return transpiled code with required React', () => {
    const transformed = transform('export default class Foo {render() {return <div />}}');

    assert.equal(transformed, 'import React, { Component, PropTypes } from "react";\nexport default class Foo {\n  render() {\n    return <div />;\n  }\n}');
  });

  it('should return not transpiled code', () => {
    const transformed = transform('console.log("hello world")');

    assert.equal(transformed, 'console.log("hello world");');
  });

  it('should check that plugin does not import React twice', () => {
    const transformed = transform('class Foo{render(){return <div/>}} class Bar{render(){return <div />}}');

    assert.equal(transformed, 'import React, { Component, PropTypes } from "react";\nclass Foo {\n  render() {\n    return <div />;\n  }\n}'
      + 'class Bar {\n  render() {\n    return <div />;\n  }\n}');
  });

  it('should does not replace users import on plugins import', () => {
    const transformed = transform('import React, { Component, PropTypes } from"react/addons"\nclass Qux{render(){return <div/>}}');

    assert.equal(transformed, 'import React, { Component, PropTypes } from "react/addons";\nclass Qux {\n  render() {\n    return <div />;\n  }\n}');
  });
});
