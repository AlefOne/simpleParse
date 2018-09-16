import { IParser, OnParseCallback } from "./IParser";
import { IParsers } from "./IParsers";
import { IParserResult, ParseResult } from "./RegExpExecArrayEx";
import { TransformFunction } from "./TransformFunction";
import { ParserBase } from "./ParserBase";

export class Sequence<T = any> extends ParserBase<T> implements IParser<T> {

    private items: IParsers;
    options: string = '';
    name: string | undefined;
    onResult: ((x: IParserResult<T>) => void) | undefined;
    toResult: TransformFunction<T> | undefined;

    constructor(...items: IParsers) {
        super();
        this.items = items;
    }

    parse(text: string, pos:number = 0, cb: OnParseCallback = undefined): IParserResult<T> |undefined{

        let result: IParserResult<T> = ParseResult.getEmpty(text, pos);
        for (let i = 0; i < this.items.length; i++) {
            let item: IParser = this.items[i];
            let wynik: IParserResult|undefined = item.parse(text, pos);
            if (wynik !== undefined) {
                result.add(wynik);
                pos = result.lastIndex;
            } else {
                return undefined;
            }
        }
        // result.lastIndex = pos;
        this.setResultValue( result );
        if (cb)
            cb(result);

        return result;

    }
    
}