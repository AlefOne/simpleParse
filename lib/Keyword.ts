import { Sequence } from "./Sequence";
import { IParser } from "./IParser";
import { Item } from "./Item";
import { IParserResult } from "./RegExpExecArrayEx";
import { Optional } from "./Optional";

export class Keyword extends Sequence<string> implements IParser<string> {

    constructor(keyword: string, trailingSpaces: boolean = true) {

        let mask = `\\b${keyword}\\b`;
        let keyWord = new Item<string>(mask);
        keyWord.toResult = toKeyWordResult;
        if (trailingSpaces)
            super(keyWord, new Optional(Item.spaces));
        else
            super(keyWord);
        this.toResult = toResult;

        function toKeyWordResult(result: IParserResult<string>): string | undefined {
            if (result.length > 0 && typeof (result[0]) === "string") {
                return <string>result[0];
            }
        }

        function toResult(result: IParserResult<string>): string | undefined {
            if (result.length >= 0) {
                return result[0].value;
            }
        }
    }


}
