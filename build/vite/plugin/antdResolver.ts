/**
 *  Introduces component library styles on demand.
 *  https://github.com/antfu/unplugin-vue-components
 */
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export function configAutoImportPlugin() {
  const styleImportPlugin = Components({
    resolvers: [AntDesignVueResolver()],
    dts: true,
    types: [],
  })
  return styleImportPlugin
}
