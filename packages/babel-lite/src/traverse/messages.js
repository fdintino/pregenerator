/**
 * Mapping of messages to be used in Babel.
 * Messages can include $0-style placeholders.
 */
export const MESSAGES = {
  readOnly: "$1 is read-only",
  scopeDuplicateDeclaration: "Duplicate declaration $1",
  traverseNeedsParent: "You must pass a scope and parentPath unless traversing a Program/File got a $1 node",
  traverseVerifyRootFunction: "You passed `traverse()` a function when it expected a visitor object, are you sure you didn't mean `{ enter: Function }`?",
  traverseVerifyVisitorProperty: "You passed `traverse()` a visitor object with the property $1 that has the invalid property $2",
  traverseVerifyNodeType: "You gave us a visitor for the node type $1 but it's not a valid type",
};

/**
 * Get a message with $0 placeholders replaced by arguments.
 */

export function get(key, ...args) {
  var msg = MESSAGES[key];
  if (!msg) throw new ReferenceError(`Unknown message ${JSON.stringify(key)}`);

  // stringify args
  args = parseArgs(args);

  // replace $0 placeholders with args
  return msg.replace(/\$(\d+)/g, function (str, i) {
    return args[--i];
  });
}

/**
 * Stingify arguments to be used inside messages.
 */

export function parseArgs(args) {
  return args.map(function (val) {
    if (val != null && val.inspect) {
      return val.inspect();
    } else {
      try {
        return JSON.stringify(val) || val + "";
      } catch (e) {
        return "unknown";
      }
    }
  });
}
