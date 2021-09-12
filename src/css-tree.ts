// may not actually need this at all
import * as cssTreeRaw from 'css-tree';
import {CssNode, SyntaxParseError} from 'css-tree';
export * from 'css-tree';

export type Matched = {
    token?: string;
    node?: CssNode;
    match?: Matched[] | null;
    syntax: {type: string; name: string; opts?: null} | null;
};

export type Match = {
    matched: Matched | null;
    iterations: number;
    error: SyntaxParseError | null;
    getTrace: () => any;
    isType: () => boolean;
    isProperty: () => boolean;
    isKeyword: () => boolean;
};

// read from css-tree source code
export type Lexer = {
    new (config: any, syntax: any, structure: any): Lexer;
    matchDeclaration(node: CssNode): Match;
    checkStructure(ast: CssNode): any;
    createDescriptor(syntax: any, type: any, name: any): any;
    addAtrule_(name: any, syntax: any): any;
    addProperty_(name: any, syntax: any): any;
    addType_(name: any, syntax: any): any;
    matchAtrulePrelude(atruleName: any, prelude: any): Match;
    matchAtruleDescriptor(atruleName: any, descriptorName: any, value: any): Match;
    matchDeclaration(node: any): Match;
    matchProperty(propertyName: any, value: any): Match;
    matchType(typeName: any, value: any): Match;
    match(syntax: any, value: any): Match;
    findValueFragments(propertyName: any, value: any, type: any, name: any): any;
    findDeclarationValueFragments(declaration: any, type: any, name: any): any;
    findAllFragments(ast: any, type: any, name: any): any;
    getAtrule(name: any): any;
    getAtruleDescriptor(atruleName: any, name: any): any;
    getProperty(name: any): any;
    getType(name: any): any;
    validate(): any;
    dump(syntaxAsAst: any, pretty: any): any;
    toString(): any;
};

export const lexer: Lexer = (cssTreeRaw as any).lexer;
