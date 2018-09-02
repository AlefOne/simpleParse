import { TransformFunction } from "./TransformFunction";
import { IParserResult, PareseResult } from "./RegExpExecArrayEx";
import { IParser, OnParseCallback } from "./IParser";
import { ParserBase } from "./ParserBase";

export class Item<T = any> extends ParserBase<T> implements IParser<T> {
    
    onResult: ((x: IParserResult<T>) => void) | undefined;

    constructor(private pattern: string, private _name?: string|undefined , public toResult: TransformFunction<T>|undefined = undefined ) {
        super();
    }

    get name():string|undefined {
        return this._name;
    }

    set name(value: string|undefined) {
        this._name = value;
    }

    get asString() {
        return this.pattern;
    }

    append(...items: Array<Item | string>): Item {

        var i: number = 0;

        if (items.length > 0) {
            let result: Item = this;
            while (i < items.length) {
                const nextItem: Item = getNextItem();
                result = result.appendItem(nextItem);
            }
            return result;
        }
        else {
            throw new Error();
        }

        function getNextItem(): Item {
            let result: Item | string = (items[i] instanceof Item) ? <Item>items[i] : new Item(<string>(items[i]));
            i++;
            return result;
        }

    }

    private appendItem(item: Item | string): Item {
        let resultPattern = this.asString + (item instanceof Item ? item.asString : item);
        return new Item(resultPattern);
    }

    parse(text: string, pos: number = 0, cb: OnParseCallback|undefined = undefined): IParserResult<T>|undefined {
        let regExp = new RegExp(this.pattern, "gm");
        regExp.lastIndex = pos;
        let wynik: RegExpExecArray | null = regExp.exec(text);
        if (wynik && wynik.index === pos) {
            let result: IParserResult<T> = new PareseResult<T>(wynik);
            result.lastIndex = regExp.lastIndex;
            if (cb) {
                cb(result);
            }
            if (this.onResult) {
                this.onResult(result);
            }
            if (this.toResult) {
                result.value = this.toResult(result);
            }
            return result;
        } else {
            return undefined;
        }
    }

    static get spaces(): Item {
        return new Item("\\s+");
    }

    static get word(): Item {
        let word = new Item<string>('\\b\\w+\\b');
        word.toResult = x => x.length > 0 ? x[0] : undefined;
        return word;
    }

}
