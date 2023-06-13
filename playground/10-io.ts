import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const getInput =function*(name:string){
//     while(true){
//         yield "hey there "+name
//     }
// }

// const i = getInput("Thiru");
// console.log(i.next().value)

rl.question("Who are you?", (name) => {
  rl.close();
  console.log(`Hey there ${name}!, lets continue`);
});
