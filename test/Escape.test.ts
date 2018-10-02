import { should, assert } from 'chai';
import { Parser, IParserResult, Item } from '../lib';

should();
describe('Test parsowania sekwenci escape w pythonie', parserTest);


function parserTest() {

    it('Test parsowania sekwencji nowej linii', testC1);
    it('Test parsowania znaku nowej linii', testC2);
    it('Test parsowania escapów', testC3);

    function testC1() {
        const parser = new Item("\\\\n");
        const result1 = parser.parse("\\n", 0);
        const result2 = parser.parse("\\naaa", 0);
    }

    function testC2() {

        const parser = new Item("\\\\\n");
        const result1 = parser.parse("\\\n", 0);
        const result2 = parser.parse("\\\naaa", 0);
    }

    function testC3() {
        const escapes = [
            { $item: "\\\\\\\\", toResult: x => "\\" },
            { $item: "\\\\'", toResult: x => "'" },
            { $item: '\\\\"', toResult: x => '"' },
            { $item: "\\\\a", toResult: x => "\a" },
            { $item: "\\\\b", toResult: x => "\b" },
            { $item: "\\\\f", toResult: x => "\f" },
            { $item: "\\\\n", toResult: x => "\n" },
            { $item: "\\\\r", toResult: x => "\r" },
            { $item: "\\\\t", toResult: x => "\t" },
            // { $item: "\\\\u[0-9, a-f,A-F]{1-4}" },
            // { $item: "\\\\U[0-9, a-f,A-F]{1-8}" },
            { $item: "\\\\0[0-7]*", toResult: x => String.fromCharCode(parseInt (x[0].substr(1), 8))},
            { $item: "\\\\x[0-9, a-f,A-F]+", toResult: x => String.fromCharCode(parseInt (x[0].substr(1), 16)) }
        ];
        const grammar = {
            escapes: { $repeat: ["@escape"], toResult: x => x.map(y => y.value).join('') },
            escape: { $or: escapes, toResult: x => x[0] }
        }

        let parser = new Parser('@escapes', grammar);
        let result1 = parser.parse('\\\\')['@escapes'];
        assert.equal ( result1, '\\' );
        let result2 = parser.parse('\\\\\\n\\t\\b')['@escapes'];
        assert.equal ( result2, '\\\n\t\b' );
        let result4 = parser.parse('\\027')['@escapes'];
        assert.equal ( result4, String.fromCharCode(23) );
        let result3 = parser.parse('\\\\\\n\\t\\b\\027\\xff')['@escapes'];
        assert.equal ( result3, '\\\n\t\b'+String.fromCharCode(23) + String.fromCharCode(255) );

    }
}