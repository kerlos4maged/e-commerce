const regex = /(a|aa)+/;
const input = `${'a'.repeat(10000)  }b`; // Long string likely to cause backtracking
const start = Date.now();
console.log(regex.test(input)); // Test your regex
console.log('Time taken:', Date.now() - start, 'ms');