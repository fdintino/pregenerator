import { BinaryOperators, AssignmentOperators } from "./core-operators";
import { Type } from "../lib/types";

const { def, or } = Type;

const BinaryOperator = or(...BinaryOperators, "**");

def("BinaryExpression").field("operator", BinaryOperator);

const AssignmentOperator = or(...AssignmentOperators, "**=");

def("AssignmentExpression").field("operator", AssignmentOperator);
