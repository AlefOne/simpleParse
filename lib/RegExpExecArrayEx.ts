import { ResultItem } from "./ResultItem";

export interface IParserResult<T = any> extends Array<ResultItem> {
    input: string;
    index: number;
    lastIndex: number;
    value: T|undefined;
}

export class PareseResult<T = any> extends Array<ResultItem> implements IParserResult<T> {

    constructor(result: RegExpExecArray) {
        super();
        result.forEach((x) => this.push(x));
        this.index = result.index;
        this.input = result.input;
        this.lastIndex = 0;
        this.value = undefined;
    }

    value: T|undefined;
    index: number;
    input: string;
    lastIndex: number;

    static get empty(): IParserResult {
        let result: IParserResult = <IParserResult>(new Array());
        result.index = 0;
        result.lastIndex = 0;
        result.value = undefined;
        return result;
    }

}



