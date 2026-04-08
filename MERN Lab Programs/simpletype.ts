// Simple Types
let username: string = "Maneesha";
let age: number = 19;
let isStudent: boolean = true;

console.log("Name:", username);
console.log("Age:", age);
console.log("Student:", isStudent);

// Array type
let marks: number[] = [85, 90, 78];
console.log("Marks:", marks);

// Tuple type
let person: [string, number] = ["Ravi", 25];
console.log("Tuple:", person);

// Enum type
enum Color {
  Red = 0,
  Green = 1,
  Blue = 2
}

let c: Color = Color.Green;
console.log("Enum value:", c); // Output: 1

// Any type (use carefully)
let randomValue: any = "Hello";
randomValue = 100;
console.log("Any type:", randomValue);

// Unknown type (safer than any)
let data: unknown = "TypeScript";

if (typeof data === "string") {
  console.log("Unknown (after type check):", data.toUpperCase());
}

// Void type
function sayHello(): void {
  console.log("Hello World");
}
sayHello();

// Never type
function throwError(): never {
  throw new Error("Error occurred");
}
// throwError(); // Uncomment to test
