import { IParser } from "./IParser";
import { ParserBase } from "./ParserBase";
import { IParserResult, ParseResult } from "./RegExpExecArrayEx";
import { TransformFunction } from "./TransformFunction";
import { Item } from "./Item";
import { Or } from "./Or";
import { Sequence } from "./Sequence";
import { Word } from "./Word";
import { Optional } from "./Optional";
import { Repeat } from "./Repeat";

const parsers = {
    $word: { parser: Word },
    $item: { parser: Item },
    $optional: { parser: Optional, getParams: prepareParser },
    $or: { parser: Or, getParams: prepareParserList },
    $sequence: { parser: Sequence, getParams: prepareParserList },
    $repeat: { parser: Repeat, getParams: prepareRepeatParams }
}

function prepareParserList(list: (Object | string)[]): IParser[] {

    let result: IParser[] = list.map(prepareParser.bind(this));
    return result;
}

function prepareParser(argument: (Object | string)): IParser {
    if (argument instanceof Object) {
        let parser: IParser = this.getParser(undefined, argument);
        return parser;
    } else if (typeof argument === "string") {
        let item = this.getGrammarItem(argument);
        let parser: IParser = this.getParser(argument, item);
        return parser;
    } else {
        throw new SyntaxError();
    }
}

function prepareRepeatParams(argument: (Object | string)): IParser | Array<any> {

    if (argument instanceof String) {
        let result = prepareParser.call(this, argument);
        return result;
    }
    if (argument instanceof Array) {
        let item = argument[0];
        let from = argument.length > 1 ? argument[1] : 0;
        let to = argument.length > 2 ? argument[2] : undefined;
        let parser = prepareParser.call(this, item);
        return [parser, from, to];
    }
    throw new SyntaxError();

}

export class Parser<T> extends ParserBase<T> implements IParser {

    toResult?: TransformFunction<T>;
    onResult: (x: IParserResult<any>) => void;

    parser: IParser;
    grammar: any;

    constructor(symbol: string, grammar: any) {
        super();
        this.grammar = grammar;
        let item = this.getGrammarItem(symbol);
        this.parser = this.getParser(symbol, item);
    }

    getGrammarItem(itemKey: string) {

        if (typeof (itemKey) === typeof ('') && itemKey.length > 0 && itemKey[0] === '@') {
            let key = itemKey.substr(1);
            if (this.grammar.hasOwnProperty(key))
                return this.grammar[key];
        }
        throw new SyntaxError(`Nieprawidłowa definicja symbolu ${itemKey}`);
    }

    parse(text: string, pos?: number, cb?: (x: IParserResult<T>) => void): IParserResult<T> {
        let wynik = this.parser.parse(text, pos, cb);
        return wynik;
    }

    toKeyValue(item) {
        let keys = [];
        let values = [];
        let key: string;
        for (key in item) {
            if (key.startsWith('$')) {
                keys.push(key);
                values.push(item[key]);
            }
        }
        if (keys.length === 1 && values.length === 1) {
            return { key: keys.pop(), value: values.pop() };
        } else {
            throw new SyntaxError(`Niepoprawna składnia gramatyki, element zawiera wartości kluczy: ${keys.join(', ')}`);
        }
    }

    getParser(symbol: string, item: any): IParser {
        let kv = this.toKeyValue(item);
        let type = kv.key;
        let args = kv.value;
        if (parsers.hasOwnProperty(type)) {
            let parser = parsers[type].parser;
            let getParams = parsers[type].getParams;
            let params = getParams ? getParams.call(this, args) : args;
            let result: IParser;
            if (params instanceof Array) {
                result = new parser(...params);
            } else {
                result = new parser(params);
            }
            result.name = symbol;
            if (item.toResult) {
                result.toResult = item.toResult;
            }
            return result;
        } else {
            throw new SyntaxError(`Nieprawiłowy typ parsera ${type} `);
        }

    }
}

