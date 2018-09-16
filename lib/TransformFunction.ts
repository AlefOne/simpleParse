import { IParserResult } from "./RegExpExecArrayEx";

export type TransformFunction<T = any> = (result: IParserResult<T>) => T;
