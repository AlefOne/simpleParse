import { should, assert } from 'chai';
import { Parser, IParserResult } from '../lib';

should();
describe('Test parsowania stringów w pythonie', parserTest);

const prefixes = [
    { $item: "r" }, { $item: "u" }, { $item: "ur" }, { $item: "R" }, { $item: "U" },
    { $item: "UR" }, { $item: "Ur" }, { $item: "uR" }, { $item: "b" }, { $item: "B" },
    { $item: "br" }, { $item: "Br" }, { $item: "bR" }, { $item: "BR" }
];

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
    { $item: "\\\\0[0-7]*", toResult: x => String.fromCharCode(parseInt(x[0].substr(1), 8)) },
    { $item: "\\\\x[0-9, a-f,A-F]+", toResult: x => String.fromCharCode(parseInt(x[0].substr(1), 16)) }
];

const grammar = {
    optionalPrefix: { $optional: "@stringprefix", toResult: optionalToResult },
    stringprefix: { $or: prefixes, toResult: prefixToResult },
    stringliteral: { $sequence: ["@optionalPrefix", "@lsString"] },
    lsString: { $or: ["@shortString", /*"@longString" */], toResult: toLsString },
    sQuot: { $item: "\\'" },
    dQuot: { $item: '\\"' },
    sQuotChars: { $item: "[^\\'\\n\\\\]*", toResult: toResult },
    dQuotChars: { $item: '[^\\"\\n\\\\]*', toResult: toResult },
    escapes: { $repeat: ["@escape", 1], toResult: x => x.map(y => y.value).join('') },
    escape: { $or: escapes, toResult: toResult },
    sEscaped: { $or: ["@escapes", "@sQuotChars"], toResult: toResult },
    dEscaped: { $or: ["@escapes", "@dQuotChars"], toResult: toResult },
    sEscapedStream: { $repeat: ["@sEscaped", 0], toResult: toRepeat },
    dEscapedStream: { $repeat: ["@dEscaped", 0], toResult: toRepeat },
    sQuoted: { $sequence: ["@sQuot", "@sEscapedStream", "@sQuot"], toResult: toQuoted },
    dQuoted: { $sequence: ["@dQuot", "@dEscapedStream", "@dQuot"], toResult: toQuoted },
    shortString: { $or: ["@sQuoted", "@dQuoted"], toResult: toResult }
};

function toResult(x) {
    return x[0];
}

function toQuoted(x) {
    return x[1].value;
}

function toRepeat(x) {
    return x.join('');
}

function toLsString(x) {
    return x ;
}


function prefixToResult(x: IParserResult) {
    if (x.length > 0) {
        return (x[0]);
    } else {
        return undefined;
    }
}

function optionalToResult(x) {
    return 1;
}

function parserTest() {

    it('Test parsowania stringów', testC1);

    function testC1() {

        var parser = new Parser('@stringliteral', grammar);
        var result0 = parser.parse("''");
        var result1 = parser.parse("'no to próbujemy'");
        var result2 = parser.parse('"no to próbujemy"');
        var result3 = parser.parse('"no to próbujemy z a\'postrofem"');
        var result4 = parser.parse("'\"w cudzysłowie\"'");
        var result5 = parser.parse("u'\"unicode w cudzysłowie\"'");
        var result6 = parser.parse("u'\"unicode\\x0A \\x0D w cudzysłowie\"'");
        // var result6 = parser.parse("'\"zwykły ze znakiem \\n nowj linii w cudzysłowie\"'");

        return;
    }

}
