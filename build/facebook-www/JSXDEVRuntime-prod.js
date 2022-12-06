/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 * @nolint
 * @preventMunge
 * @preserve-invariant-messages
 */

"use strict";

var React = require("react");

// ATTENTION
const REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");

// Re-export dynamic flags from the www version.
const dynamicFeatureFlags = require("ReactFeatureFlags");

const disableInputAttributeSyncing =
    dynamicFeatureFlags.disableInputAttributeSyncing,
  enableTrustedTypesIntegration =
    dynamicFeatureFlags.enableTrustedTypesIntegration,
  disableSchedulerTimeoutBasedOnReactExpirationTime =
    dynamicFeatureFlags.disableSchedulerTimeoutBasedOnReactExpirationTime,
  warnAboutSpreadingKeyToJSX = dynamicFeatureFlags.warnAboutSpreadingKeyToJSX,
  replayFailedUnitOfWorkWithInvokeGuardedCallback =
    dynamicFeatureFlags.replayFailedUnitOfWorkWithInvokeGuardedCallback,
  enableFilterEmptyStringAttributesDOM =
    dynamicFeatureFlags.enableFilterEmptyStringAttributesDOM,
  enableLegacyFBSupport = dynamicFeatureFlags.enableLegacyFBSupport,
  deferRenderPhaseUpdateToNextBatch =
    dynamicFeatureFlags.deferRenderPhaseUpdateToNextBatch,
  enableDebugTracing = dynamicFeatureFlags.enableDebugTracing,
  skipUnmountedBoundaries = dynamicFeatureFlags.skipUnmountedBoundaries,
  createRootStrictEffectsByDefault =
    dynamicFeatureFlags.createRootStrictEffectsByDefault,
  enableUseRefAccessWarning = dynamicFeatureFlags.enableUseRefAccessWarning,
  disableNativeComponentFrames =
    dynamicFeatureFlags.disableNativeComponentFrames,
  disableSchedulerTimeoutInWorkLoop =
    dynamicFeatureFlags.disableSchedulerTimeoutInWorkLoop,
  enableLazyContextPropagation =
    dynamicFeatureFlags.enableLazyContextPropagation,
  enableSyncDefaultUpdates = dynamicFeatureFlags.enableSyncDefaultUpdates,
  enableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay =
    dynamicFeatureFlags.enableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay,
  enableClientRenderFallbackOnTextMismatch =
    dynamicFeatureFlags.enableClientRenderFallbackOnTextMismatch,
  enableTransitionTracing = dynamicFeatureFlags.enableTransitionTracing; // On WWW, true is used for a new modern build.

const ReactSharedInternals =
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

const ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;

const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

const ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */
const ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
const ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

const jsxDEV = undefined;

exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsxDEV = jsxDEV;
