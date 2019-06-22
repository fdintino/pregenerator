import { createFilter } from 'rollup-pluginutils';
import istanbul from 'istanbul-lib-instrument';

export default function (options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    transform(code, id) {
      if (!filter(id)) return;

      const sourceMap = !!options.sourceMap;
      const opts = Object.assign({}, options.instrumenterConfig, {
        produceSourceMap: sourceMap,
        esModules: true
      });

      if (sourceMap) {
        opts.codeGenerationOptions = Object.assign(
          {},
          opts.codeGenerationOptions || {
            format: { compact: !opts.noCompact }
          },
          { sourceMap: id, sourceMapWithCode: true }
        );
      }
      const instrumenter = new (options.instrumenter || istanbul).createInstrumenter(opts);
      
      code = instrumenter.instrumentSync(code, id);

      const map = instrumenter.lastSourceMap() || { mappings: '' };

      return { code, map };
    }
  };
}
