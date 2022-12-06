/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from 'react-reconciler/src/ReactInternalTypes';

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 *
 * 当前组件的所有者是当前组件被创建的并且可以包含任何组建的一个组件
 */
const ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: (null: null | Fiber),
};

export default ReactCurrentOwner;
