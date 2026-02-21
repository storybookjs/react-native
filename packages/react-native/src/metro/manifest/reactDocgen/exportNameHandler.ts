/**
 * Sets `exportName` on the documentation:
 * - 'default' for default exports
 * - The exported identifier for named exports (incl. aliases)
 * - Undefined when not exported / undetermined
 */
import type { Handler, NodePath, babelTypes as t } from 'react-docgen';
import { utils } from 'react-docgen';

const { isReactForwardRefCall } = utils;

function nameFromId(path?: NodePath<t.Node> | null): string | undefined {
  if (!path) {
    return undefined;
  }
  if (path.isIdentifier()) {
    return path.node.name;
  }
  if (path.isStringLiteral()) {
    return path.node.value;
  }
  return undefined;
}

function isInlineDefaultExport(path: NodePath<t.Node>): boolean {
  let p: NodePath<t.Node> | null = path;
  while (p && p.parentPath) {
    if (p.parentPath.isExportDefaultDeclaration()) {
      return true;
    }
    p = p.parentPath as NodePath<t.Node>;
  }
  return false;
}

function findProgram(path: NodePath<t.Node>): NodePath<t.Program> | undefined {
  const found = path.findParent((p) => p.isProgram()) as NodePath<t.Node> | null;
  return found && found.isProgram() ? found : undefined;
}

function getLocalName(
  componentDefinition: NodePath<t.Node>,
  fallback?: string
): string | undefined {
  if (fallback) {
    return fallback;
  }

  if (
    (componentDefinition.isClassDeclaration() || componentDefinition.isFunctionDeclaration()) &&
    componentDefinition.has('id')
  ) {
    const idPath = componentDefinition.get('id') as NodePath<t.Identifier>;
    return nameFromId(idPath);
  }

  if (
    componentDefinition.isArrowFunctionExpression() ||
    componentDefinition.isFunctionExpression() ||
    isReactForwardRefCall(componentDefinition)
  ) {
    let p: NodePath<t.Node> | null = componentDefinition;
    while (p && p.parentPath) {
      if (p.parentPath.isVariableDeclarator()) {
        const id = p.parentPath.get('id');
        return nameFromId(id);
      }
      if (p.parentPath.isAssignmentExpression()) {
        const left = p.parentPath.get('left');
        const lhs = nameFromId(left);
        if (lhs) {
          return lhs;
        }
      }
      p = p.parentPath as NodePath<t.Node>;
    }
  }

  return undefined;
}

const exportNameHandler: Handler = (documentation, componentDefinition) => {
  if (isInlineDefaultExport(componentDefinition)) {
    documentation.set('exportName', 'default');
    return;
  }

  const actual = documentation.get('actualName');
  const actualName = typeof actual === 'string' ? actual : undefined;
  const localName = getLocalName(componentDefinition, actualName);

  const programPath = findProgram(componentDefinition);
  if (!programPath) {
    documentation.set('exportName', undefined);
    return;
  }

  const body = programPath.get('body');

  for (const stmt of body) {
    if (stmt.isExportNamedDeclaration() && stmt.has('declaration')) {
      const decl = stmt.get('declaration');

      if (decl.isFunctionDeclaration() || decl.isClassDeclaration()) {
        const name = nameFromId(decl.get('id') as NodePath<t.Identifier>);
        if (name && name === localName) {
          documentation.set('exportName', name);
          return;
        }
      }

      if (decl.isVariableDeclaration()) {
        const decls = decl.get('declarations');
        for (const d of decls) {
          if (d.isVariableDeclarator()) {
            const id = d.get('id');
            if (id.isIdentifier() && id.node.name === localName) {
              documentation.set('exportName', localName);
              return;
            }
          }
        }
      }
    }

    if (stmt.isExportNamedDeclaration() && stmt.has('specifiers')) {
      const specs = stmt.get('specifiers');
      for (const s of specs) {
        if (s.isExportSpecifier()) {
          const local = nameFromId(s.get('local'));
          const exported = nameFromId(s.get('exported'));
          if (local && local === localName) {
            documentation.set(
              'exportName',
              exported === 'default' ? 'default' : (exported ?? local)
            );
            return;
          }
        }
      }
    }

    if (stmt.isExportDefaultDeclaration()) {
      const decl = stmt.get('declaration');
      if (decl.isIdentifier() && decl.node.name === localName) {
        documentation.set('exportName', 'default');
        return;
      }
    }
  }

  documentation.set('exportName', undefined);
};

export default exportNameHandler;
