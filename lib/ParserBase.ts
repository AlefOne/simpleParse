import { IParser, OnParseCallback } from "./IParser";
import { IParserResult } from "./RegExpExecArrayEx";
import { TransformFunction } from "./TransformFunction";

export abstract class ParserBase<T = any> implements IParser<T> {

    abstract parse(text: string, pos?: number, cb?: OnParseCallback): IParserResult<T>|undefined;
    abstract get name(): string | undefined;
    abstract toResult: TransformFunction<T>|undefined;
    abstract onResult: ( (x:IParserResult<T>) => void ) | undefined = undefined;

    find(text: string, pos: number = 0): IParserResult<T> |undefined {
        for (; pos < text.length; pos++) {
            let result = this.parse(text, pos);
            if (result) {
                return result;
            }
        }
        return undefined;

    }

    match(text: string): Array<IParserResult<T>> {
        let result = new Array<IParserResult<T>>();
        let pos: number = 0;
        let textPart: string = text;
        let found: IParserResult<T>|undefined = this.find(textPart, pos);
        while (found) {
            result.push(found);
            pos = found.lastIndex;
            found = this.find(textPart, pos);
        }
        return result;

    }

}


