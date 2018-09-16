import { IParserResult } from "./RegExpExecArrayEx";
import { TransformFunction } from "./TransformFunction";

export type OnParseCallback = ((x: IParserResult) => void) | undefined;

export interface IParser<T=any> {

    toResult?: TransformFunction<T> | undefined;
    onResult: ((x: IParserResult<T>) => void) | undefined;

    parse(text: string, pos?: number, cb?: OnParseCallback): IParserResult<T> | undefined;

    name?: string;

};
