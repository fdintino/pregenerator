// return {
//   name: "transform-regenerator",
//
//   visitor: {
//     ArrayExpression(path) {
//       const { node, scope } = path;
//       const elements = node.elements;
//       if (!hasSpread(elements)) return;
//
//       const nodes = build(elements, scope);
//       let first = nodes[0];
//
//       // If there is only one element in the ArrayExpression and
//       // the element was transformed (Array.prototype.slice.call or toConsumableArray)
//       // we know that the transformed code already takes care of cloning the array.
//       // So we can simply return that element.
//       if (nodes.length === 1 && first !== elements[0].argument) {
//         path.replaceWith(first);
//         return;
//       }
//
//       // If the first element is a ArrayExpression we can directly call
//       // concat on it.
//       // `[..].concat(..)`
//       // If not then we have to use `[].concat(arr)` and not `arr.concat`
//       // because `arr` could be extended/modified (e.g. Immutable) and we do not know exactly
//       // what concat would produce.
//       if (!t.isArrayExpression(first)) {
//         first = t.arrayExpression([]);
//       } else {
//         nodes.shift();
//       }
//
//       path.replaceWith(
//         t.callExpression(
//           t.memberExpression(first, t.identifier("concat")),
//           nodes,
//         ),
//       );
//     },
//
//     CallExpression(path) {
//       const { node, scope } = path;
//
//       const args = node.arguments;
//       if (!hasSpread(args)) return;
//
//       const calleePath = path.get("callee");
//
//       let contextLiteral = scope.buildUndefinedNode();
//
//       node.arguments = [];
//
//       let nodes;
//       if (args.length === 1 && args[0].argument.name === "arguments") {
//         nodes = [args[0].argument];
//       } else {
//         nodes = build(args, scope);
//       }
//
//       const first = nodes.shift();
//       if (nodes.length) {
//         node.arguments.push(
//           t.callExpression(
//             t.memberExpression(first, t.identifier("concat")),
//             nodes,
//           ),
//         );
//       } else {
//         node.arguments.push(first);
//       }
//
//       const callee = node.callee;
//
//       if (calleePath.isMemberExpression()) {
//         const temp = scope.maybeGenerateMemoised(callee.object);
//         if (temp) {
//           callee.object = t.assignmentExpression("=", temp, callee.object);
//           contextLiteral = temp;
//         } else {
//           contextLiteral = t.cloneNode(callee.object);
//         }
//         t.appendToMemberExpression(callee, t.identifier("apply"));
//       } else {
//         node.callee = t.memberExpression(node.callee, t.identifier("apply"));
//       }
//
//       node.arguments.unshift(t.cloneNode(contextLiteral));
//     },
//
//     NewExpression(path) {
//       const { node, scope } = path;
//       let args = node.arguments;
//       if (!hasSpread(args)) return;
//
//       const nodes = build(args, scope);
//
//       let context = t.arrayExpression([t.nullLiteral()]);
//
//       args = t.callExpression(
//         t.memberExpression(context, t.identifier("concat")),
//         nodes);
//
//       path.replaceWith(t.newExpression(
//         t.callExpression(
//           t.memberExpression(
//             t.memberExpression(
//               t.memberExpression(
//                 t.identifier("Function"),
//                 t.identifier("prototype"),
//               ),
//               t.identifier("bind")
//             ),
//             t.identifier("apply")
//           ),
//           [node.callee, args]
//         ),
//         []
//       ));
//     },
//   },
// };
