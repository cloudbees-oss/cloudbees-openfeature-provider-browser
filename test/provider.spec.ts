import {CloudbeesProvider} from '../src'
import {Client, OpenFeature} from '@openfeature/web-sdk'

describe('Cloudbees Provider', () => {
  it('invalid creation', async () => {
    await expect(CloudbeesProvider.build('')).rejects.toThrow('invalid rollout apikey')
  })

  describe('integration tests', () => {
    let client: Client

    beforeAll(async () => {
      const APP_KEY = '62bee5bbca1059d18808adad' // CloudBees Provider test Data appKey
      OpenFeature.setProvider(await CloudbeesProvider.build(APP_KEY));
      client = OpenFeature.getClient();
    })

    describe('boolean flags', () => {
      it('with targeting on', () => {
        expect(client.getBooleanValue('boolean-static-true', false)).toBe(true)
        expect(client.getBooleanValue('boolean-static-false', true)).toBe(false)
      })

      it('with targeting off', () => {
        expect(client.getBooleanValue('boolean-disabled', false)).toBe(false)
        expect(client.getBooleanValue('boolean-disabled', true)).toBe(true)
      })

      it('using a context', async () => {
        await OpenFeature.setContext({stringproperty: 'on'})
        expect(client.getBooleanValue('boolean-with-context', false)).toBe(true)
        await OpenFeature.setContext({stringproperty: 'off'})
        expect(client.getBooleanValue('boolean-with-context', false)).toBe(false)
      })
    })

    describe('string flags', () => {
      it('with targeting on', () => {
        expect(client.getStringValue('string-static-yes', 'default')).toBe('yes')
        expect(client.getStringValue('string-static-no', 'default')).toBe('no')
      })

      it('with targeting off', () => {
        expect(client.getStringValue('string-disabled', 'banana')).toBe('banana')
      })

      it('using a context', async () => {
        await OpenFeature.setContext({stringproperty: 'on'})
        expect(client.getStringValue('string-with-context', 'default')).toBe('yes')
        await OpenFeature.setContext({stringproperty: 'off'})
        expect(client.getStringValue('string-with-context', 'default')).toBe('no')
        await OpenFeature.setContext({not_defined: 'whatever'})
        expect(client.getStringValue('string-with-context', 'default')).toBe('not specified')
        await OpenFeature.setContext({})
        expect(client.getStringValue('string-with-context', 'default')).toBe('not specified')
        await OpenFeature.clearContexts()
        expect(client.getStringValue('string-with-context', 'default')).toBe('not specified')
      })
    })

    describe('number flags', () => {
      it('with targeting on', () => {
        expect(client.getNumberValue('string-static-5', 5)).toBe(5)
      })

      it('with targeting off', () => {
        expect(client.getNumberValue('string-disabled', 7)).toBe(7)
      })

      it('using a context', async () => {
        await OpenFeature.setContext({stringproperty: '1'})
        expect(client.getNumberValue('integer-with-context', -1)).toBe(1)
        await OpenFeature.setContext({stringproperty: '5'})
        expect(client.getNumberValue('integer-with-context', -1)).toBe(5)
        await OpenFeature.setContext({not_defined: 'whatever'})
        expect(client.getNumberValue('integer-with-context', -1)).toBe(10)
        await OpenFeature.setContext({})
        expect(client.getNumberValue('integer-with-context', -1)).toBe(10)
        await OpenFeature.clearContexts()
        expect(client.getNumberValue('integer-with-context', -1)).toBe(10)
      })
    })

    describe('object flags', () => {
      it('test we do not support these types of flag', () => {
        expect(client.getObjectDetails('not-supported', {a: 'b'})).toEqual({
          errorCode: 'INVALID_CONTEXT',
          errorMessage: 'Not implemented - CloudBees feature management does not support an object type. Only String, Number and Boolean',
          flagKey: 'not-supported',
          flagMetadata: {},
          reason: 'ERROR',
          value: {a: 'b'},
        })
      })
    })

    describe('flags with differently typed context values', () => {
      it('positive matches for supported types (string/number/boolean)', async () => {
        // // Test positive matches for supported types (string/number/boolean)
        await OpenFeature.setContext({stringproperty: 'one'})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(1)
        await OpenFeature.setContext({numberproperty: 1})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(1)
        await OpenFeature.setContext({booleanproperty: true})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(1)
      })

      it('negative matches for supported types (string/number/boolean) - it should serve the default value', async () => {
        await OpenFeature.setContext({stringproperty: 'no'})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(-1)
        await OpenFeature.setContext({numberproperty: 0})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(-1)
        await OpenFeature.setContext({booleanproperty: false})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(-1)

        // Unexpected/unsupported contexts
        await OpenFeature.setContext({badproperty: 'whatever'})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(-1)
        await OpenFeature.setContext({stringproperty: []})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(-1)
        await OpenFeature.setContext({stringproperty: {}})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(-1)
        await OpenFeature.setContext({stringproperty: 1})
        expect(client.getNumberValue('integer-with-complex-context', -1)).toBe(-1)
      })
    })
  })
})
