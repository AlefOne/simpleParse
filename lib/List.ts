import { IParser, OnParseCallback } from "./IParser";
import { IParserResult, PareseResult } from "./RegExpExecArrayEx";
import { TransformFunction } from "./TransformFunction";
import { ParserBase } from "./ParserBase";

function toResult<T>(result: IParserResult<Array<T>>): Array<T> {
    return result.map(x => x.value);
}
export class List<T=any> extends ParserBase<Array<T>> implements IParser<Array<T>> {

    name: string | undefined;
    onResult: ((x: IParserResult) => void) | undefined;
    toResult: TransformFunction<Array<T>> = toResult;

    constructor(public listItem: IParser<T>, public separator: IParser) {
        super();
    }

    parse(text: string, pos:number = 0, cb: OnParseCallback = undefined): IParserResult | undefined{

        let result: IParserResult = PareseResult.empty;
        let item = this.listItem.parse(text, pos, inc);

        if (!item) {
            return undefined;
        } else {
            result.push(item);
        }

        while (item = this.separator.parse(text.substr(result.lastIndex), pos, inc)) {
            item = this.listItem.parse(text.substr(result.lastIndex), pos, inc);
            if (!item) {
                return undefined;
            } else {
                result.push(item);
            }

        }
        if (cb) {
            cb(result);
        }
        if (this.onResult)
            this.onResult(result);

        if (this.toResult) {
            result.value = this.toResult(result);
        }
        return result;

        function inc(x: IParserResult) {
            if (x.index === 0) {
                result.lastIndex += x.lastIndex;
            }
        }

    }
}

