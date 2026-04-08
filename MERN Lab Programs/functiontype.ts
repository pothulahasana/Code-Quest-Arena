// Function with parameter and return type
function add(a: number, b: number): number {
  return a + b;
}
console.log("Sum:", add(10, 20));

// Function with optional parameter
function greet(name: string, msg?: string): string {
  return msg ? `${msg}, ${name}` : `Hello, ${name}`;
}
console.log(greet("Pravallika"));
console.log(greet("Pravallika", "Welcome"));

// Default parameter
function multiply(a: number, b: number = 2): number {
  return a * b;
}
console.log("Multiply:", multiply(5));
console.log("Multiply:", multiply(5, 3));

// Arrow function with return type
const square = (x: number): number => {
  return x * x;
};
console.log("Square:", square(6));

// Function returning void
function printMessage(message: string): void {
  console.log("Message:", message);
}
printMessage("TypeScript Functions");

// Function with rest parameters
function total(...nums: number[]): number {
  return nums.reduce((sum, n) => sum + n, 0);
}
console.log("Total:", total(1, 2, 3, 4));