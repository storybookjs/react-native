/**
 * Based on react-docgen's displayNameHandler but defines an `actualName` property
 * taken from the component's actual name rather than displayName.
 */
import type { Handler, NodePath, babelTypes as t } from 'react-docgen';
import { utils } from 'react-docgen';

const { getNameOrValue, isReactForwardRefCall } = utils;

const actualNameHandler: Handler = function actualNameHandler(documentation, componentDefinition) {
  documentation.set('definedInFile', componentDefinition.hub.file.opts.filename);

  if (
    (componentDefinition.isClassDeclaration() || componentDefinition.isFunctionDeclaration()) &&
    componentDefinition.has('id')
  ) {
    documentation.set(
      'actualName',
      getNameOrValue(componentDefinition.get('id') as NodePath<t.Identifier>)
    );
  } else if (
    componentDefinition.isArrowFunctionExpression() ||
    componentDefinition.isFunctionExpression() ||
    isReactForwardRefCall(componentDefinition)
  ) {
    let currentPath: NodePath = componentDefinition;

    while (currentPath.parentPath) {
      if (currentPath.parentPath.isVariableDeclarator()) {
        documentation.set('actualName', getNameOrValue(currentPath.parentPath.get('id')));
        return;
      }
      if (currentPath.parentPath.isAssignmentExpression()) {
        const leftPath = currentPath.parentPath.get('left');

        if (leftPath.isIdentifier() || leftPath.isLiteral()) {
          documentation.set('actualName', getNameOrValue(leftPath));
          return;
        }
      }

      currentPath = currentPath.parentPath;
    }
    documentation.set('actualName', '');
  }
};

export default actualNameHandler;
