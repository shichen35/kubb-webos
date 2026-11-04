import { test } from 'node:test'
import assert from 'node:assert/strict'

const mem = new Map()
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
}
const { createStore } = await import('./useStore.js')

test('createStore moves data saved under the old yfsp: prefix to kubb:', () => {
  mem.set('yfsp:favorites', '[{"id":"a"}]')
  assert.deepEqual(createStore('kubb:favorites', []).get(), [{ id: 'a' }])
  assert.equal(mem.get('kubb:favorites'), '[{"id":"a"}]')
  assert.equal(mem.has('yfsp:favorites'), false)
})

test('createStore prefers existing kubb: data over a leftover yfsp: copy', () => {
  mem.set('kubb:settings', '{"x":1}')
  mem.set('yfsp:settings', '{"x":2}')
  assert.deepEqual(createStore('kubb:settings', {}).get(), { x: 1 })
})
