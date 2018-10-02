import { TransformFunction } from "./TransformFunction";
import { IParserResult, ParseResult } from "./RegExpExecArrayEx";
import { IParser, OnParseCallback } from "./IParser";
import { ParserBase } from "./ParserBase";

export class Item<T> extends ParserBase<T> implements IParser<T> {

    onResult: ((x: IParserResult<T>) => void) | undefined;

    constructor(private pattern: string, name?: string, public toResult: TransformFunction<T> = undefined) {
        super();
    }

    get asString() {
        return this.pattern;
    }

    parse(text: string, pos: number = 0, cb: OnParseCallback | undefined = undefined): IParserResult<T> | undefined {
        let regExp = new RegExp(this.pattern, "gm");
        regExp.lastIndex = pos;
        let wynik: RegExpExecArray | null = regExp.exec(text);
        if (wynik && wynik.index === pos) {
            let result: IParserResult<T> = new ParseResult<T>(text, wynik.index, regExp.lastIndex);
            wynik.forEach(element => result.push(element));
            this.setResultValue(result);
            if (cb) {
                cb(result);
            }
            return result;
        } else {
            return undefined;
        }
    }

    static get spaces(): Item<string> {
        return new Item("\\s+");
    }

}
