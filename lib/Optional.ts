import { IParser, OnParseCallback } from "./IParser";
import { IParserResult, ParseResult } from "./RegExpExecArrayEx";
import { TransformFunction } from "./TransformFunction";
import { ParserBase } from "./ParserBase";

export class Optional<T=any> extends ParserBase<T> implements IParser<T> {

    toResult: TransformFunction<T>|undefined;
    onResult: ((x: IParserResult<T>) => void) | undefined;
    name: string | undefined;

    constructor(public arg: IParser<T>) {
        super();
    }

    parse(text: string, pos:number=0, cb: OnParseCallback = undefined): IParserResult {

        const empty = ParseResult.getEmpty<T>(text, pos);
        let result: IParserResult<T>|undefined = this.arg.parse(text, pos);

        if (!result) {
            result = empty;
        }
        this.setResultValue( result );
        if (cb) {
            cb(result);
        }

        return result;

    }

}
