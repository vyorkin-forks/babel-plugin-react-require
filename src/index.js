export default function ({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path, { file }) {
        file.set('hasJSX', true);
      },

      Program: {
        enter(path, { file }) {
          file.set('hasJSX', false);
        },

        exit({ node, scope }, { file }) {
          if (!(file.get('hasJSX') && !scope.hasBinding('React'))) {
            return;
          }

          var reactImportDeclaration = t.importDeclaration([
            t.importDefaultSpecifier(t.identifier('React')),
            t.importSpecifier(t.identifier('Component'), t.identifier('Component')),
            t.importSpecifier(t.identifier('PropTypes'), t.identifier('PropTypes'))
          ], t.stringLiteral('react'));

          node.body.unshift(reactImportDeclaration);
        },
      },
    },
  };
}
