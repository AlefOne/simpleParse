import { should, assert } from 'chai';
import * as re from '../lib';
//import { IParserResult } from '../Parser';

should();
describe('Test parsera Any', AnyTest);

function AnyTest() {
    const item = new re.Item("Index");
    item.toResult = x => x[0];
    const anyPrser = new re.Optional(item);

    it('Test Any', testAny);

    function testAny() {
        let parsed = anyPrser.parse("Index");
        assert.strictEqual(parsed.index, 0, `Wartość parsed.index powinna być równa 0, a jest równa ${parsed.index}`);
        assert.isAbove(parsed.lastIndex, 0, `Wartość parsed.lastIndex powinna być większa niż 0, a jest równa ${parsed.lastIndex}`);
        assert.property<re.IParserResult>(parsed, 'value', 'Brak property value');
        parsed.value.should.eq("Index");

        parsed = anyPrser.parse("newIndex");
        parsed.index.should.eq(0);
        parsed.lastIndex.should.eq(0);
        assert.property<re.IParserResult>(parsed, 'value', 'Brak property value');
        assert.isUndefined(parsed.value);

        parsed = anyPrser.parse("newIndex", 3);
        parsed.index.should.eq(3);
        parsed.lastIndex.should.eq(8);
        assert.property<re.IParserResult>(parsed, 'value', 'Brak property value');
        parsed.value.should.eq("Index");
    }

}
