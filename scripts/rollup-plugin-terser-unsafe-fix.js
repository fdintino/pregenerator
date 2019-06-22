import { parse, print } from 'recast';
import { visit, builders as b, namedTypes as n } from 'ast-types';

function transform(ast) {
  visit(ast, {
    visitCallExpression(path) {
      const callee = path.get('callee');
      if (!n.MemberExpression.check(callee.value)) {
        return this.traverse(path);
      }
      const {property, object} = callee.value;
      if (object.name !== 'hasOwnProperty' || property.name !== 'call') {
        return this.traverse(path);
      }
      const objPath = callee.get('object');
      if (objPath.scope.lookup('hasOwnProperty')) {
        return this.traverse(path);
      }
      const args = path.value.arguments;
      path.replace(
        b.callExpression(
          b.memberExpression(
            b.memberExpression(
              b.memberExpression(b.identifier('Object'), b.identifier('prototype')),
              b.identifier('hasOwnProperty')
            ),
            b.identifier('call')
          ),
          args));
      return false;
    },
  });
}



export default () => ({
  name: 'terser-unsafe-fix',
  transform(code, id) {
    const ast = parse(code, {sourceFileName: id});
    transform(ast);
    return print(ast, {sourceMapName: id});
  }
});
