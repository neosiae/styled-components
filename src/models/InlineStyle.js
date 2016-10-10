// @flow
import hashStr from 'glamor/lib/hash'
import camelizeStyleName from 'fbjs/lib/camelizeStyleName'

import type { RuleSet } from '../types'
import flatten from '../utils/flatten'
import parse from '../vendor/postcss-safe-parser/parse'

const generated = {}

/*
 InlineStyle takes arbitrary CSS and generates a flat object
 */
export default class InlineStyle {
  rules: RuleSet

  constructor(rules: RuleSet) {
    this.rules = rules
  }

  generateStyleObject(executionContext: Object) {
    const flatCSS = flatten(this.rules, executionContext).join('')
    const hash = hashStr(flatCSS)
    if (!generated[hash]) {
      const root = parse(flatCSS)
      const styleObject = {}
      root.each(node => {
        if (node.type === 'decl') {
          styleObject[camelizeStyleName(node.prop)] = node.value
        } else {
          /* eslint-disable no-console */
          console.warn(`Node of type ${node.type} not supported as an inline style`)
        }
      })
      generated[hash] = styleObject
    }
    return generated[hash]
  }
}
