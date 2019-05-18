import { mount, tag2 as tag } from 'riot';
import compiler from 'riot-compiler';
import { alreadyCompiledMarker, getRidOfRiotNoise } from '../compileStageFunctions';

export default function renderRaw(sourceCode) {
  const tag2 = tag;
  // eslint-disable-next-line no-eval
  eval(
    getRidOfRiotNoise(
      `${compiler.compile(sourceCode.replace(alreadyCompiledMarker, '').trim(), {})}`
    )
  );
  mount('root', /tag2\s*\(\s*'([^']+)'/.exec(sourceCode)[1], {});
}
