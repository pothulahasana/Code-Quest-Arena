// Function with parameter and return type
function add(a, b) {
    return a + b;
}
console.log("Sum:", add(10, 20));
// Function with optional parameter
function greet(name, msg) {
    return msg ? "".concat(msg, ", ").concat(name) : "Hello, ".concat(name);
}
console.log(greet("Pravallika"));
console.log(greet("Pravallika", "Welcome"));
// Default parameter
function multiply(a, b) {
    if (b === void 0) { b = 2; }
    return a * b;
}
console.log("Multiply:", multiply(5));
console.log("Multiply:", multiply(5, 3));
// Arrow function with return type
var square = function (x) {
    return x * x;
};
console.log("Square:", square(6));
// Function returning void
function printMessage(message) {
    console.log("Message:", message);
}
printMessage("TypeScript Functions");
// Function with rest parameters
function total() {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
    }
    return nums.reduce(function (sum, n) { return sum + n; }, 0);
}
console.log("Total:", total(1, 2, 3, 4));
