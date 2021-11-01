import "./es2020";
import { namedTypes as N } from "../gen/namedTypes";
import { Type } from "../lib/types";
import { defaults } from "../lib/shared";

const { def, or } = Type;

def("JSX").aliases("Node");

def("JSXAttribute")
  .bases("BaseNode").aliases("JSX")
  .build("name", "value")
  .field("name", or(def("JSXIdentifier"), def("JSXNamespacedName")))
  .field(
    "value",
    or(
      def("Literal"), // attr="value"
      def("JSXExpressionContainer"), // attr={value}
      def("JSXElement"), // attr=<div />
      def("JSXFragment"), // attr=<></>
      null // attr= or just attr
    ),
    defaults["null"]
  );

def("JSXIdentifier").bases("BaseNode").aliases("JSX").build("name").field("name", String);

def("JSXNamespacedName")
  .bases("BaseNode").aliases("JSX")
  .build("namespace", "name")
  .field("namespace", def("JSXIdentifier"))
  .field("name", def("JSXIdentifier"));

def("JSXMemberExpression")
  .bases("BaseNode").aliases("JSX")
  .build("object", "property")
  .field("object", or(def("JSXIdentifier"), def("JSXMemberExpression")))
  .field("property", def("JSXIdentifier"))
  .field("computed", Boolean, defaults.false);

const JSXElementName = or(
  def("JSXIdentifier"),
  def("JSXNamespacedName"),
  def("JSXMemberExpression")
);

def("JSXSpreadAttribute")
  .bases("BaseNode").aliases("JSX")
  .build("argument")
  .field("argument", def("Expression"));

const JSXAttributes = [or(def("JSXAttribute"), def("JSXSpreadAttribute"))];

def("JSXExpressionContainer")
  .bases("BaseNode").aliases("JSX")
  .build("expression")
  .field("expression", or(def("Expression"), def("JSXEmptyExpression")));

const JSXChildren = [
  or(
    def("JSXText"),
    def("JSXExpressionContainer"),
    def("JSXSpreadChild"),
    def("JSXElement"),
    def("JSXFragment"),
    def("Literal") // Legacy: Esprima should return JSXText instead.
  ),
];

def("JSXElement")
  .bases("BaseNode").aliases("JSX", "Expression")
  .build("openingElement", "closingElement", "children")
  .field("openingElement", def("JSXOpeningElement"))
  .field("closingElement", or(def("JSXClosingElement"), null), defaults["null"])
  .field("children", JSXChildren, defaults.emptyArray)
  .field(
    "name",
    JSXElementName,
    function (this: N.JSXElement) {
      // Little-known fact: the `this` object inside a default function
      // is none other than the partially-built object itself, and any
      // fields initialized directly from builder function arguments
      // (like openingElement, closingElement, and children) are
      // guaranteed to be available.
      return this.openingElement.name;
    },
    true
  ) // hidden from traversal
  .field(
    "selfClosing",
    Boolean,
    function (this: N.JSXElement) {
      return this.openingElement.selfClosing;
    },
    true
  ) // hidden from traversal
  .field(
    "attributes",
    JSXAttributes,
    function (this: N.JSXElement) {
      return this.openingElement.attributes;
    },
    true
  ); // hidden from traversal

def("JSXOpeningElement")
  .bases("BaseNode").aliases("JSX")
  .build("name", "attributes", "selfClosing")
  .field("name", JSXElementName)
  .field("attributes", JSXAttributes, defaults.emptyArray)
  .field("selfClosing", Boolean, defaults["false"]);

def("JSXClosingElement")
  .bases("BaseNode").aliases("JSX")
  .build("name")
  .field("name", JSXElementName);

def("JSXFragment")
  .bases("BaseNode").aliases("JSX", "Expression")
  .build("openingFragment", "closingFragment", "children")
  .field("openingFragment", def("JSXOpeningFragment"))
  .field("closingFragment", def("JSXClosingFragment"))
  .field("children", JSXChildren, defaults.emptyArray);

def("JSXOpeningFragment").bases("BaseNode").aliases("JSX").build();

def("JSXClosingFragment").bases("BaseNode").aliases("JSX").build();

def("JSXText")
  .bases("BaseNode").aliases("JSX")
  .build("value", "raw")
  .field("value", String)
  .field("raw", String, function (this: N.JSXText) {
    return this.value;
  });

def("JSXEmptyExpression").bases("BaseNode").aliases("JSX").build();

def("JSXSpreadChild")
  .bases("BaseNode").aliases("JSX")
  .build("expression")
  .field("expression", def("Expression"));
