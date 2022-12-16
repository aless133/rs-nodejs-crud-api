import fsPromises from "node:fs/promises";
import { some } from "./common";

if (true) {
	const c = 1;
}
fun1(1233);
some();
some();
some();
fsPromises.writeFile('wow', "hoho! "+(new Date()), { flag: "wx" });

// fun1('qwe');

function fun1(n: number) {
	// console.log(c);
	console.log(n);
}
