import { should, assert } from 'chai';
import * as re from '../lib/index';

should();
describe('Test klasy Repeat', listTest);

function listTest() {

    it('Test powtarzalnika 0-max', testC1);
    it('Test powtarzalnika 5-max', testC2);
    it('Test powtarzalnika 5-10' , testC3);

    function testC1() {
        const grammar = {
            item: { $item: "[a-z]" },
            items: { $repeat: ["@item"] }
        }
        const item = new re.Parser('@items', grammar);
        let parsed1 = <re.IParserResult>item.parse("");
        let parsed2 = <re.IParserResult>item.parse("ciagznakowpelnotekstowy");
        let parsed3 = <re.IParserResult>item.parse("ciag z nakowpelnotekstowy");

    }

    function testC2() {
        const grammar = {
            item: { $item: "[a-z]" },
            items: { $repeat: ["@item", 5] }
        }
        const item = new re.Parser('@items', grammar);
        let parsed1 = <re.IParserResult>item.parse("ciagznakowpelnotekstowy");
        let parsed2 = <re.IParserResult>item.parse("ciagz nakowpelnotekstowy");
        let parsed3 = <re.IParserResult>item.parse("ciag znakowpelnotekstowy");

    }
    function testC3() {
        const grammar = {
            item: { $item: "[a-z]" },
            items: { $repeat: ["@item", 5, 10] }
        }
        const item = new re.Parser('@items', grammar);
        let parsed1 = <re.IParserResult>item.parse("ciagznakowpelnotekstowy");
        let parsed2 = <re.IParserResult>item.parse("ciagz nakowpelnotekstowy");
        let parsed3 = <re.IParserResult>item.parse("ciagzaaaaa nakowpelnotekstowy");
        let parsed4 = <re.IParserResult>item.parse("cia nakowpelnotekstowy");

    }
}

