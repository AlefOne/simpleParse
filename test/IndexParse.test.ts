import { should, assert } from 'chai';
import * as Re from '../lib/index';

type ColName = string;
type Name = string;
type IndexColumns = IndexColumn[];
type SortType = "ASC" | "DESC" | undefined;

class QName extends Object {
    shema: Name | undefined;
    name: Name;

    constructor(name: Name, shema?: Name) {
        super();
        this.shema = shema;
        this.name = name;
    }
}

class IndexColumn extends Object {

    constructor(public readonly name: ColName, public readonly type: SortType = "ASC") {
        super();
    }

}

class NameParser extends Re.Or<Name> {

    constructor() {

        const word = Re.Item.word;
        const sword = new Re.Sequence<Name>(new Re.Item("\\\""), Re.Item.word, new Re.Item("\\\""));
        sword.toResult = toSword;
        super(word, sword);
        return;

        function toSword(result: Re.IParserResult<Name>): Name {
            return result[1].value;
        }

    }
}

class QualifiedNameParser extends Re.Sequence<QName>{

    constructor() {

        const name = new NameParser();
        const dot = new Re.Item("\\.");
        const qualifier = new Re.Optional<Name>(new Re.Sequence<Name>(name, dot));
        super(qualifier, name);
        this.toResult = toResult;

        function toResult(result: Re.IParserResult<QName>): QName | undefined {
            if (result.length > 1) {
                return new QName(result[1].value, result[0].value);
            }
            return undefined;
        }
    }
}

class ColumnNameParser extends Re.Sequence<IndexColumn> {

    static order = new Re.Optional(new Re.Sequence(Re.Item.spaces, new Re.Or(new Re.Keyword('ASC'), new Re.Keyword('DESC'))));

    constructor() {

        super(new NameParser(), ColumnNameParser.order);

        this.toResult = colNameItemToResult;

        function colNameItemToResult(parseResult: Re.IParserResult<IndexColumn>) {
            return new IndexColumn(parseResult[0].value, parseResult[1].value);
        }
    }
}

class ColumnListParser extends Re.Sequence<IndexColumns> {

    static anySpaces = new Re.Optional(Re.Item.spaces);
    static lp = new Re.Item("\\(\\s*");
    static rp = new Re.Item("\\)\\s*");
    static colName = new ColumnNameParser();
    static commaItem = new Re.Item('\\s*\\,\\s*');
    static colNames = new Re.List<IndexColumn>(ColumnListParser.colName, ColumnListParser.commaItem);

    constructor() {
        super(ColumnListParser.anySpaces, ColumnListParser.lp, ColumnListParser.colNames, ColumnListParser.rp);
        this.toResult = colListToResult;
        return;

        function colListToResult(parseResult: Re.IParserResult<IndexColumns>) {
            return parseResult[2].value;
        }

    }

}

class IndexParser extends Re.Sequence<IndexColumns> {

    private static _create = new Re.Keyword('CREATE');
    static get create() {
        return IndexParser._create;
    }
    static unique = new Re.Optional(new Re.Keyword('UNIQUE'));
    static index = new Re.Keyword('INDEX');
    static on = new Re.Keyword('ON');
    static indexName = new QualifiedNameParser();
    static tableName = new QualifiedNameParser();
    static colList = new ColumnListParser();

    constructor() {

        super(IndexParser.create, IndexParser.unique, IndexParser.index, IndexParser.indexName, Re.Item.spaces, IndexParser.on, IndexParser.tableName, IndexParser.colList);

        this.toResult = toResult;

        function toResult(parseResult: Re.IParserResult<IndexColumns>): IndexColumns {
            let result = parseResult[7].value;
            return result;
        }

    }
}

should();

describe('Test parsowania słowa kluczowego', NameParseTest);
describe('Test aprsowania listy',  ListParseTest);
describe('Test parsowania deklaracji indeksu', IndexParseTest);

function ListParseTest()
{
    const iParser = new ColumnListParser();
    it ( "Pojedynczy", findOne );
    it ( "Podwójny", findTwo );

    function findOne (){
        let text = 'CREATE INDEX "SCMADM"."SCM_INTRAS_CN_ID_IDX" ON "SCMADM"."SCM_INTRAS" ("INTRAS_CN_ID") \n    ;';
        const pos = 91-21 ;
        let result = iParser.parse( text, pos) ;
        assert.isDefined(result, `Nie znaleziono czegoś co powinno się znaeźć w posycji ${pos}`);
        assert.equal( result.index, pos, `Miało być ${pos} a jest ${result.index}`);
        assert.isDefined ( result.value, `Brak wartości dla pozycji ${pos}`);
        assert.equal ( result.value.length, 1, `Miała być jedna sztuka a jest ${result.value.length}` );
        assert.equal ( result.value[0].name, 'INTRAS_CN_ID', `Miała zostać znaleziona 'INTRAS_CN_ID' a jest ${result.value[0].name}` );
        assert.equal ( result.value[0].type, 'ASC', `nieprawidłowy typ '${result.value[0].type}'` );
    };

    function findTwo (){
        let text = 'CREATE INDEX "SCMADM"."SCM_INTRAS_CN_ID_IDX" ON "SCMADM"."SCM_INTRAS" ("INTRAS_CN_ID", "INTRAS_ID") \n    ;';
        const pos = 91-21 ;
        let result = iParser.parse( text, pos ) ;
        assert.isDefined(result, `Nie znaleziono czegoś co powinno się znaeźć w posycji ${pos}`);
        assert.equal( result.index, pos, `Miało być ${pos} a jest ${result.index}`);
        assert.isDefined ( result.value, `Brak wartości dla pozycji ${pos}`);
        assert.equal ( result.value.length, 2, `Miały być dwie sztuki a jest ${result.value.length}` );
        assert.equal ( result.value[0].name, 'INTRAS_CN_ID', `Miała zostać znaleziona 'INTRAS_CN_ID' a jest ${result.value[0].name}` );
        assert.equal ( result.value[0].type, 'ASC', `nieprawidłowy typ '${result.value[0].type}'` );
    };

}

function NameParseTest () {
    const iParser = new NameParser();
    const text = 'CREATE INDEX "SCMADM"."SCM_INTRAS_CN_ID_IDX" ON "SCMADM"."SCM_INTRAS" ("INTRAS_CN_ID") \n    ;';
    const tabs = [32-19, 41-19, 67-19, 76-19, 90-19];
    for ( let i=0; i<tabs.length; i++ ){
        let pos = tabs[i] ;
        it ( `Szukam nazwy w pozycji ${pos}`, testName ) ;

        function testName(){
            let result = iParser.parse( text, pos) ;
            assert.isDefined(result, `Nie znaleziono czegoś co powinno się znaeźć w posycji ${pos}`);
            assert.equal( result.index, pos, `Miało być ${pos} a jest ${result.index}`);
            assert.isDefined ( result.value, `Brak wartości dla pozycji ${pos}`);
        }
    }

}


function IndexParseTest() {

    const iParser = new IndexParser();
    const text = 'CREATE INDEX "SCMADM"."SCM_INTRAS_CN_ID_IDX" ON "SCMADM"."SCM_INTRAS" ("INTRAS_CN_ID") \n    ;';
    it("SCM_INTRAS_CN_ID_IDX", IPTest1);

    function IPTest1() {
        let result = iParser.parse(text);
        assert.isDefined(result, "Nie znaleziono czegoś co powinno się znaeźć");
        return ;
    }

}
