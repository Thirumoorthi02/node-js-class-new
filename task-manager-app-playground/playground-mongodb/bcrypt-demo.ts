import * as bcrypt from "bcrypt";

async function hash(pw: string) {
  const hashed = await bcrypt.hash(pw, 8);
  const isMatch = await bcrypt.compare(pw+" ", hashed);
  console.log(pw, hashed, isMatch);
}

hash("123")