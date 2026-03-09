# CloudBees Feature Management provider for OpenFeature

[![a](https://img.shields.io/badge/slack-%40cncf%2Fopenfeature-brightgreen?style=flat&logo=slack)](https://cloud-native.slack.com/archives/C0344AANLA1)
[![OpenFeature Specification](https://img.shields.io/static/v1?label=OpenFeature%20Specification&message=v0.5.1&color=yellow)](https://github.com/open-feature/spec/tree/v0.5.1)
[![OpenFeature Web SDK](https://img.shields.io/static/v1?label=OpenFeature%20Web%20SDK&message=v1.0.0&color=green)](https://github.com/open-feature/js-sdk/tree/main/packages/web)
[![npm version](https://badge.fury.io/js/cloudbees-openfeature-provider-browser.svg)](https://badge.fury.io/js/cloudbees-openfeature-provider-browser)
[![CloudBees Rox SDK](https://img.shields.io/static/v1?label=Rox%20SDK&message=v5.4.1&color=green)](https://www.npmjs.com/package/rox-browser)
[![Known Vulnerabilities](https://snyk.io/test/github/rollout/cloudbees-openfeature-provider-browser/badge.svg)](https://snyk.io/test/github/rollout/cloudbees-openfeature-provider-browser)

This is the [CloudBees](https://www.cloudbees.com/products/feature-management) provider implementation for [OpenFeature](https://openfeature.dev/) for the [Web SDK](https://github.com/open-feature/js-sdk/tree/main/packages/web).

OpenFeature provides a vendor-agnostic abstraction layer on Feature Flag management.

This provider allows the use of CloudBees Feature Management as a backend for Feature Flag configurations.

## Requirements
- node 14 or greater

## Installation

### Add it to your build

```bash
npm install cloudbees-openfeature-provider-browser
```
or
```bash
yarn add cloudbees-openfeature-provider-browser
```

### Confirm peer dependencies are installed
```bash
npm install @openfeature/web-sdk
```
or
```bash
yarn add @openfeature/web-sdk
```

### Configuration

Follow the instructions on the [Web SDK project](https://github.com/open-feature/js-sdk/tree/main/packages/web) for how to use the SDK.

You can configure the CloudBees provider by doing the following:

```typescript
import {OpenFeature} from '@openfeature/web-sdk';
import {CloudbeesProvider} from 'cloudbees-openfeature-provider-browser'

const sdkKey = '<INSERT_SDK_KEY_HERE>'
OpenFeature.setProvider(await CloudbeesProvider.build(sdkKey));
const client = OpenFeature.getClient();
const value = await client.getBooleanValue('enabled-new-feature', false);
```
