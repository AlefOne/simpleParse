import { ResultItem } from "./ResultItem";

export interface IParserResult<T = any> extends Array<ResultItem> {
    input: string;
    index: number;
    lastIndex: number;
    value?: T;
    name?: string;
    add<U extends IParserResult>(elem: U): number;
}

export class ParseResult<T = any> extends Array<ResultItem> implements IParserResult<T> {

    constructor(input: string, index: number = 0, lastIndex: number = index, value: T = undefined) {
        super();
        this.index = index;
        this.lastIndex = lastIndex;
        this.value = value;
        this.input = input;
    }

    add<U extends IParserResult>(elem: U): number {
        if (this.lastIndex < elem.lastIndex) {
            this.lastIndex = elem.lastIndex;
        }
        return super.push(elem);
    }

    value: T | undefined;
    index: number;
    input: string;
    lastIndex: number;

    static getEmpty<U=any>(input: string, index: number = 0, lastIndex: number = index): IParserResult<U> {
        let result: IParserResult = new ParseResult(input, index, lastIndex, undefined);
        return result;
    }

}



