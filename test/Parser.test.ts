import { should, assert } from 'chai';
import { Parser, IParserResult } from '../lib';

should();
describe('Test klasy Parser', parserTest);

class AliasedName {

    constructor(public name: string, public alias?: string) {
    }

    toString(): string {
        return this.alias ? `"${this.alias}"."${this.name}"` : `"${this.name}"`;
    }

}

function parserTest() {

    const grammar = {
        name: { $word: [], toResult: toName },
        qName: { $sequence: [{ $item: "\\\"" }, '@name', { $item: "\\\"" }], toResult: toQName },
        identifier: { $or: ["@qName", "@name"], toResult: toIdetifier },
        alias: { $sequence: ["@identifier", { $item: "\\." }], toResult: toAlias },
        aliased: { $sequence: ["@alias", "@identifier"], toResult: toAliased },
        aliasedName: { $or: ["@aliased", "@identifier"], toResult: toAliasedName }
    };

    function toName(result: IParserResult) {
        return result[0];
    }

    function toQName(result: IParserResult) {
        return result[1]["@name"];
    }

    function toIdetifier(result: IParserResult) {
        let rv: string = null;
        if (result['@name']) {
            rv = (result['@name']).toUpperCase();;
        } else {
            rv = result['@qName'];
        }
        return rv;
    }

    function toAlias(result: IParserResult) {
        let rv = result[0]["@identifier"];
        return rv;
    }

    function toAliased(result: IParserResult) {
        let shema = result[0]['@alias'];
        let name = result[1]['@identifier'];
        return new AliasedName(name, shema);
    }

    function toAliasedName(result: IParserResult) {
        if (result['@aliased']) {
            return result['@aliased'];
        }
        if (result['@identifier']) {
            return new AliasedName(result['@identifier']);
        }
    }

    it('Test klasy item', testC1);

    function testC1() {
        const item = new Parser('@aliasedName', grammar);
        let parsed = item.parse('"Index"');
        assert.isDefined(parsed, 'Miało sparsować i chyba nie sparsowało');
        parsed = item.parse("Słowo index", 6);
        assert.isDefined(parsed, 'Miało sparsować i chyba nie sparsowało');
        parsed = item.parse("Słowo sekadm.index", 6);
        assert.isDefined(parsed, 'Miało sparsować i chyba nie sparsowało');
        parsed = item.parse('Słowo sekadm."index"', 6);
        assert.isDefined(parsed, 'Miało sparsować i chyba nie sparsowało');
        parsed = item.parse('Słowo "sekadm"."index"', 6);
        assert.isDefined(parsed, 'Miało sparsować i chyba nie sparsowało');
    }

}

