// Simple Types
var username = "Maneesha";
var age = 19;
var isStudent = true;
console.log("Name:", username);
console.log("Age:", age);
console.log("Student:", isStudent);
// Array type
var marks = [85, 90, 78];
console.log("Marks:", marks);
// Tuple type
var person = ["Ravi", 25];
console.log("Tuple:", person);
// Enum type
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
console.log("Enum value:", c);
// Any type (special)
var randomValue = "Hello";
randomValue = 100;
console.log("Any type:", randomValue);
// Unknown type
var data = "TypeScript";
console.log("Unknown:", data);
// Void type
function sayHello() {
    console.log("Hello World");
}
sayHello();
// Never type
function throwError() {
    throw new Error("Error occurred");
}
// throwError(); // uncomment to test
