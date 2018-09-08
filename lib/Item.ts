import { TransformFunction } from "./TransformFunction";
import { IParserResult, ParseResult } from "./RegExpExecArrayEx";
import { IParser, OnParseCallback } from "./IParser";
import { ParserBase } from "./ParserBase";

type ItemResult = Array<string>;
export class Item<T> extends ParserBase<T> implements IParser<T> {

    onResult: ((x: IParserResult<T>) => void) | undefined;

    constructor(private pattern: string, private _name?: string, public toResult: TransformFunction<T> = undefined) {
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
            let result: IParserResult<T> = new ParseResult<T>(text, wynik.index, regExp.lastIndex );
            wynik.forEach(element => result.push(element));

            if (cb) {
                cb(result);
            }
            if (this.onResult) {
                this.onResult(result);
            }
            if (this.toResult) {
                result.value = this.toResult(result);
            }
            return result;
        } else {
            return undefined;
        }
    }


    static get spaces(): Item<string> {
        return new Item("\\s+");
    }

    static get word(): Item<string> {
        let word = new Item<string>('\\b\\w+\\b');
        word.toResult = x => x.length > 0 ? x[0] : undefined;
        return word;
    }

}
