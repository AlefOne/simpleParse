import { IParser, OnParseCallback } from "./IParser";
import { IParserResult } from "./RegExpExecArrayEx";
import { TransformFunction } from "./TransformFunction";
import { ParserBase } from "./ParserBase";

export class Or<T = any> extends ParserBase<T> implements IParser<T> {
    toResult: TransformFunction<T> | undefined;
    onResult: ((x: IParserResult<T>) => void) | undefined;

    name: string | undefined;
    protected args: IParser<T>[];

    constructor(...args: IParser<T>[]) {
        super();
        this.args = args;
    }

    parse(text: string, pos: number = 0, cb: OnParseCallback = undefined): IParserResult<T> | undefined {
        for (let i: number = 0; i < this.args.length; i++) {
            const item: IParser = this.args[i];
            const result: IParserResult | undefined = item.parse(text, pos);
            if (result && result.index === pos) {
                this.setResultValue(result);
                if (cb)
                    cb(result);
                return result;
            }
        }
        return undefined;
    }
}
