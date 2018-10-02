import { IParser, OnParseCallback } from "./IParser";
import { IParsers } from "./IParsers";
import { IParserResult, ParseResult } from "./RegExpExecArrayEx";
import { TransformFunction } from "./TransformFunction";
import { ParserBase } from "./ParserBase";

export class Repeat<T = any> extends ParserBase<T> implements IParser<T> {

    private item: IParser;
    options: string = '';
    name: string | undefined;
    onResult: ((x: IParserResult<T>) => void) | undefined;
    toResult: TransformFunction<T> | undefined;

    constructor(item: IParser, public min: number = 0, public max?: number) {
        super();
        this.item = item;
    }

    parse(text: string, pos: number = 0, cb: OnParseCallback = undefined): IParserResult<T> | undefined {

        let result: IParserResult<T> = ParseResult.getEmpty(text, pos);
        let item: IParser = this.item;

        for (var wynik = item.parse(text, pos), i = 0; wynik && (!this.max || (i < this.max)); i++ , wynik = item.parse(text, pos)) {
            if (pos === wynik.lastIndex && i >= this.min && !this.max) {
                break;
            }
            result.add(wynik);
            pos = result.lastIndex;
        }

        if (i < this.min) {
            return undefined;
        }

        this.setResultValue(result);

        if (cb)
            cb(result);

        return result;

    }

}