import { should, assert } from 'chai';
import * as re from '../lib/index';

should();
describe('Test klasy item', listTest);

function listTest() {

    const item = new re.Item("Index");
    item.onResult = onResult;
    item.toResult = x=>x[0];
    let result: re.IParserResult;

    it('Test klasy item', testC1);

    function testC1() {
        let parsed = <re.IParserResult>
        item.parse("Index");
        parsed.should.eq(result, `Miał być 1 element a jest bzdura`);
    }

    function onResult(x: re.IParserResult) {
        result = x;
    }

}

