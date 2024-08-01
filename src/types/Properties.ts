import type { Defaults } from "./Defaults";
export type Properties<T extends Defaults> = Partial<{
	[K in keyof T]: T[K]["value"];
}>;
