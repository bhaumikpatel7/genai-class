// Import the `get_encoding` function from the `tiktoken` package.
//
// `tiktoken` is a tokenizer library.
// A tokenizer converts normal text into smaller units called tokens.
//
// Tokens can represent:
// - a complete word
// - part of a word
// - punctuation
// - spaces
// - special characters
import { get_encoding } from "tiktoken";


// Load the tokenizer configuration named "gpt2".
//
// Different AI models may use different tokenization rules.
// The "gpt2" encoding decides how text should be split into tokens.
//
// `encoderForGpt2` now contains methods such as:
// - encode(): converts text into token IDs
// - decode(): converts token IDs back into byte data
const encoderForGpt2 = get_encoding("gpt2");


// Convert the string "Hello,Bhaumik" into token IDs.
//
// The tokenizer analyzes the text and splits it into tokens.
// Each token is represented by a unique integer.
//
// For example, the tokenizer may treat:
// - "Hello"
// - ","
// - "Bha"
// - "umik"
//
// as separate tokens, depending on the GPT-2 tokenization rules.
//
// The returned value is normally a Uint32Array.
// A Uint32Array is a typed JavaScript array that stores
// positive integer values.
//
// `encoded` contains the numeric token IDs for the text.
const encoded = encoderForGpt2.encode("Hello,Bhaumik");


// Print the encoded token IDs to the console.
//
// The result may look similar to:
//
// Uint32Array(4) [15496, 11, 33, 12345]
//
// The exact token IDs depend on how the GPT-2 tokenizer
// divides the input text.
console.log(encoded);


// Convert the token IDs back into their original byte representation.
//
// `decode()` receives the token IDs stored inside `encoded`.
//
// It does not directly return a normal JavaScript string.
// It returns a Uint8Array containing UTF-8 encoded bytes.
//
// `decoded_op` therefore contains bytes representing:
//
// "Hello,Bhaumik"
const decoded_op = encoderForGpt2.decode(encoded);


// Convert the decoded UTF-8 bytes into a normal JavaScript string.
//
// `new TextDecoder()` creates a built-in JavaScript decoder.
//
// `.decode(decoded_op)` converts the Uint8Array bytes into readable text.
//
// The final output printed to the console should be:
//
// Hello,Bhaumik
console.log(new TextDecoder().decode(decoded_op));