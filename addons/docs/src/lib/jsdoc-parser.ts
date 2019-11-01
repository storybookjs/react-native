import doctrine from 'doctrine';

export interface JsDocAst {
  description?: string;
  tags: any[];
}

export function parseComment(comment: string): JsDocAst {
  let ast;

  try {
    ast = doctrine.parse(comment, {
      tags: ['param', 'arg', 'argument', 'returns'],
      sloppy: true,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);

    throw new Error('Cannot parse JSDoc tags.');
  }

  return ast;
}
