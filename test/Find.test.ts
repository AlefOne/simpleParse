import { should, assert } from 'chai';
import * as re from '../lib';

should();
describe('Test dla funkcji find', AnyTest);

function AnyTest() {

    const item = new re.Item("Index");
    item.toResult = x => x[0];

    const word = re.Item.word;

    it('Test Item.find', itemTest);

    function itemTest() {

        let parsed = <re.IParserResult>item.find("1223Indexaaa");
        assert.isDefined(parsed, "Nie znaleziono czegoś co powinno się znaeźć");
        assert.strictEqual(parsed.index, 4, `Wartość parsed.index powinna być równa 4, a jest równa ${parsed.index}`);
        assert.strictEqual(parsed.lastIndex, 9, `Wartość parsed.lastIndex powinna równa 9, a jest równa ${parsed.lastIndex}`);
        assert.property<re.IParserResult>(parsed, 'value', 'Brak property value');
        parsed.value.should.eq("Index");

        parsed = <re.IParserResult>item.find("1223Inexaaa");
        assert.isUndefined(parsed, "Znaleziono coś co nie powinno się znaeźć");

        let tekstSłowny = "-----+*_Slowo12 ";
        parsed = <re.IParserResult>word.find(tekstSłowny);
        assert.strictEqual(parsed.index, 7, `Wartość parsed.index powinna być równa 7, a jest równa ${parsed.index}`);
        assert.strictEqual(parsed.lastIndex, 15, `Wartość parsed.lastIndex powinna równa 15, a jest równa ${parsed.lastIndex}`);
        assert.property<re.IParserResult>(parsed, 'value', 'Brak property value');
        parsed.value.should.eq("_Slowo12");

    }

}
