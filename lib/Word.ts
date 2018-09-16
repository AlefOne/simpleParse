import { IParser } from "./IParser";
import { Item } from "./Item";
import { TransformFunction } from "./TransformFunction";
import { ParserBase } from "./ParserBase";
import { IParserResult } from "./RegExpExecArrayEx";

function defaultToResult<T>(result: IParserResult<T>): T {
    return result[0];
}
export class Word<T = string> extends Item<T> implements IParser<T> {

    constructor(name?: string, toResult?: TransformFunction<T>) {
        super('\\b\\w+\\b', name, toResult);
        if (!toResult) {
            this.toResult = defaultToResult ;
        }
    }
}

