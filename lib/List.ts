import { IParser, OnParseCallback } from "./IParser";
import { IParserResult, ParseResult } from "./RegExpExecArrayEx";
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

        let result: IParserResult<Array<T>> = ParseResult.getEmpty<Array<T>>(text, pos);
        let item = this.listItem.parse(text, pos);

        if (item) {
            result.add(item);
            pos = item.lastIndex ;
        } else {
            return undefined;
        }

        while (item = this.separator.parse(text, pos)) {
            pos = item.lastIndex ;
            item = this.listItem.parse(text, pos);
            if (!item) {
                return undefined;
            } else {
                result.add(item);
                pos = item.lastIndex;
            }

        }

        this.setResultValue(result);
        if (cb) {
            cb(result);
        }

        return result;

    }
}

