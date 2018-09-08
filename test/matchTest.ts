import { should, assert } from 'chai';
import * as re from '../lib/index';

should();
describe('Testy dla funkcji match', MatchTest);

function MatchTest() {

    const keyword = new re.Keyword("GRANT");
    keyword.toResult = x => x[0];
    const grants:string  = `  GRANT FLASHBACK ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT DEBUG ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT QUERY REWRITE ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT ON COMMIT REFRESH ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT REFERENCES ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT UPDATE ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT SELECT ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT INSERT ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT AGRANT INDEX ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT DELETE ON "KSO_VM_RUCHY" TO PUBLIC;
    GRANT ALTER ON "KSO_VM_RUCHY" TO PUBLIC;
  ` ;

    it( 'Test znajdowania słów kluczowych', grantTest );

    function grantTest():void{
        let result = keyword.match(grants);
        assert.equal(result.length, 11, `Miało być 11 wyników a jest ${result.length}`);
    }

}

