import { IParser, OnParseCallback } from "./IParser";
import { IParsers } from "./IParsers";
import { IParserResult, PareseResult } from "./RegExpExecArrayEx";
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

        let result: IParserResult<T> = PareseResult.empty;
        result.index = pos ;
        for (let i = 0; i < this.items.length; i++) {
            let item: IParser = this.items[i];
            let wynik: IParserResult|undefined = item.parse(text, pos, inc);
            if (wynik !== undefined) {
                result.push(wynik);
                pos = wynik.lastIndex;
            } else {
                return undefined;
            }
        }
        result.lastIndex = pos;
        if (cb)
            cb(result);
        if (this.onResult)
            this.onResult(result);
        if (this.toResult)
            result.value = this.toResult(result);

        return result;

        function inc(x: IParserResult) {
            if (x.index === 0) {
                pos += x.lastIndex;
            }
        }

    }
    
}