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

'use strict';

if (__DEV__) {
  (function() {

          'use strict';

/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
}
          "use strict";

// $FlowFixMe[cannot-resolve-module]
var dynamicFeatureFlags = require("SchedulerFeatureFlags"); // Re-export dynamic flags from the www version.

var enableIsInputPending = dynamicFeatureFlags.enableIsInputPending,
  enableSchedulerDebugging = dynamicFeatureFlags.enableSchedulerDebugging,
  enableProfilingFeatureFlag = dynamicFeatureFlags.enableProfiling,
  enableIsInputPendingContinuous =
    dynamicFeatureFlags.enableIsInputPendingContinuous,
  frameYieldMs = dynamicFeatureFlags.frameYieldMs,
  continuousYieldMs = dynamicFeatureFlags.continuousYieldMs,
  maxYieldMs = dynamicFeatureFlags.maxYieldMs;
var enableProfiling = enableProfilingFeatureFlag;

/**
 * 向堆中添加节点
 * @param {*} heap
 * @param {*} node
 */
function push(heap, node) {
  var index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}
/**
 * 检查堆顶节点
 * @param {*} heap
 * @returns
 */

function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}
/**
 * 弹出堆顶元素
 * @param {*} heap
 * @returns
 */

function pop(heap) {
  if (heap.length === 0) {
    return null;
  }

  var first = heap[0];
  var last = heap.pop();

  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }

  return first;
}

function siftUp(heap, node, i) {
  var index = i;

  while (index > 0) {
    var parentIndex = (index - 1) >>> 1;
    var parent = heap[parentIndex];

    if (compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function siftDown(heap, node, i) {
  var index = i;
  var length = heap.length;
  var halfLength = length >>> 1;

  while (index < halfLength) {
    var leftIndex = (index + 1) * 2 - 1;
    var left = heap[leftIndex];
    var rightIndex = leftIndex + 1;
    var right = heap[rightIndex]; // If the left or right node is smaller, swap with the smaller of those.

    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  var diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

// TODO: Use symbols?
var ImmediatePriority = 1;
var UserBlockingPriority = 2;
var NormalPriority = 3;
var LowPriority = 4;
var IdlePriority = 5;

var runIdCounter = 0;
var mainThreadIdCounter = 0; // Bytes per element is 4

var INITIAL_EVENT_LOG_SIZE = 131072;
var MAX_EVENT_LOG_SIZE = 524288; // Equivalent to 2 megabytes

var eventLogSize = 0;
var eventLogBuffer = null;
var eventLog = null;
var eventLogIndex = 0;
var TaskStartEvent = 1;
var TaskCompleteEvent = 2;
var TaskErrorEvent = 3;
var TaskCancelEvent = 4;
var TaskRunEvent = 5;
var TaskYieldEvent = 6;
var SchedulerSuspendEvent = 7;
var SchedulerResumeEvent = 8;

function logEvent(entries) {
  if (eventLog !== null) {
    var offset = eventLogIndex;
    eventLogIndex += entries.length;

    if (eventLogIndex + 1 > eventLogSize) {
      eventLogSize *= 2;

      if (eventLogSize > MAX_EVENT_LOG_SIZE) {
        // Using console['error'] to evade Babel and ESLint
        console["error"](
          "Scheduler Profiling: Event log exceeded maximum size. Don't " +
            "forget to call `stopLoggingProfilingEvents()`."
        );
        stopLoggingProfilingEvents();
        return;
      }

      var newEventLog = new Int32Array(eventLogSize * 4); // $FlowFixMe[incompatible-call] found when upgrading Flow

      newEventLog.set(eventLog);
      eventLogBuffer = newEventLog.buffer;
      eventLog = newEventLog;
    }

    eventLog.set(entries, offset);
  }
}

function startLoggingProfilingEvents() {
  eventLogSize = INITIAL_EVENT_LOG_SIZE;
  eventLogBuffer = new ArrayBuffer(eventLogSize * 4);
  eventLog = new Int32Array(eventLogBuffer);
  eventLogIndex = 0;
}
function stopLoggingProfilingEvents() {
  var buffer = eventLogBuffer;
  eventLogSize = 0;
  eventLogBuffer = null;
  eventLog = null;
  eventLogIndex = 0;
  return buffer;
}
function markTaskStart(task, ms) {
  if (enableProfiling) {
    if (eventLog !== null) {
      // performance.now returns a float, representing milliseconds. When the
      // event is logged, it's coerced to an int. Convert to microseconds to
      // maintain extra degrees of precision.
      logEvent([TaskStartEvent, ms * 1000, task.id, task.priorityLevel]);
    }
  }
}
function markTaskCompleted(task, ms) {
  if (enableProfiling) {
    if (eventLog !== null) {
      logEvent([TaskCompleteEvent, ms * 1000, task.id]);
    }
  }
}
function markTaskCanceled(task, ms) {
  if (enableProfiling) {
    if (eventLog !== null) {
      logEvent([TaskCancelEvent, ms * 1000, task.id]);
    }
  }
}
function markTaskErrored(task, ms) {
  if (enableProfiling) {
    if (eventLog !== null) {
      logEvent([TaskErrorEvent, ms * 1000, task.id]);
    }
  }
}
function markTaskRun(task, ms) {
  if (enableProfiling) {
    runIdCounter++;

    if (eventLog !== null) {
      logEvent([TaskRunEvent, ms * 1000, task.id, runIdCounter]);
    }
  }
}
function markTaskYield(task, ms) {
  if (enableProfiling) {
    if (eventLog !== null) {
      logEvent([TaskYieldEvent, ms * 1000, task.id, runIdCounter]);
    }
  }
}
function markSchedulerSuspended(ms) {
  if (enableProfiling) {
    mainThreadIdCounter++;

    if (eventLog !== null) {
      logEvent([SchedulerSuspendEvent, ms * 1000, mainThreadIdCounter]);
    }
  }
}
function markSchedulerUnsuspended(ms) {
  if (enableProfiling) {
    if (eventLog !== null) {
      logEvent([SchedulerResumeEvent, ms * 1000, mainThreadIdCounter]);
    }
  }
}

/* eslint-disable no-var */
// 获取当前时间，优先使用performance.now ，否则使用Date.now

var hasPerformanceNow = // $FlowFixMe[method-unbinding]
  typeof performance === "object" && typeof performance.now === "function";

if (hasPerformanceNow) {
  var localPerformance = performance;

  exports.unstable_now = function() {
    return localPerformance.now();
  };
} else {
  var localDate = Date;

  var _initialTime = localDate.now();

  exports.unstable_now = function() {
    return localDate.now() - _initialTime;
  };
} // Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111

var maxSigned31BitInt = 1073741823; // 不同优先级对应的延迟时间
// Times out immediately

var IMMEDIATE_PRIORITY_TIMEOUT = -1; // Eventually times out

var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000; // Never times out

var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt; // Tasks are stored on a min heap
// 任务队列都用最小堆来存储，方便直接取出优先级最高的节点

var taskQueue = []; // 当前已到期可执行的任务

var timerQueue = []; // 延期执行的任务(还未到可以执行的时间)
// Incrementing id counter. Used to maintain insertion order.
// 自增id，用于记录任务id

var taskIdCounter = 1; // Pausing the scheduler is useful for debugging.
// 标识当前调度是否暂停，在debug时有用

var isSchedulerPaused = false; // 当前任务

var currentTask = null; // 当前优先级

var currentPriorityLevel = NormalPriority; // This is set while performing work, to prevent re-entrance.
// 标识是否正在执行工作

var isPerformingWork = false;
var isHostCallbackScheduled = false;
var isHostTimeoutScheduled = false; // 添加setTimeout 和 setImmediate的polyfill
// Capture local references to native APIs, in case a polyfill overrides them.

var localSetTimeout = typeof setTimeout === "function" ? setTimeout : null;
var localClearTimeout =
  typeof clearTimeout === "function" ? clearTimeout : null;
var localSetImmediate =
  typeof setImmediate !== "undefined" ? setImmediate : null; // IE and Node.js + jsdom
// 判断用户正在进行输入，以便让出控制权

var isInputPending =
  typeof navigator !== "undefined" && // $FlowFixMe[prop-missing]
  navigator.scheduling !== undefined && // $FlowFixMe[incompatible-type]
  navigator.scheduling.isInputPending !== undefined
    ? navigator.scheduling.isInputPending.bind(navigator.scheduling)
    : null;
var continuousOptions = {
  includeContinuous: enableIsInputPendingContinuous
};
/**
 * 将延迟任务队列中已到期的任务添加到执行队列中
 * @param {*} currentTime
 * @returns
 */

function advanceTimers(currentTime) {
  // Check for tasks that are no longer delayed and add them to the queue.
  // 检查不再延时的任务并将其添加到队列中
  // 检视堆顶元素
  var timer = peek(timerQueue);

  while (timer !== null) {
    if (timer.callback === null) {
      // 判断任务是否被取消(因为用数组实现堆，无法直接删除指定堆元素, 只能通过这种方式解决)
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // Timer fired. Transfer to the task queue.
      // 任务已到期，可以执行了，从延迟队列中移除转入当前执行队列中
      // 并按照到期时间排序
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer); // 信息收集相关

      if (enableProfiling) {
        markTaskStart(timer, currentTime);
        timer.isQueued = true;
      }
    } else {
      // Remaining timers are pending.
      // 没有需要转移的任务了
      return;
    }

    timer = peek(timerQueue);
  }
}

function handleTimeout(currentTime) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    } else {
      var firstTimer = peek(timerQueue);

      if (firstTimer !== null) {
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

function flushWork(hasTimeRemaining, initialTime) {
  if (enableProfiling) {
    markSchedulerUnsuspended(initialTime);
  } // We'll need a host callback the next time work is scheduled.

  isHostCallbackScheduled = false; // 如果当前有延时调度定时器，先清空延时调度，立即执行的调度优先级更高

  if (isHostTimeoutScheduled) {
    // We scheduled a timeout but it's no longer needed. Cancel it.
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  var previousPriorityLevel = currentPriorityLevel;

  try {
    if (enableProfiling) {
      try {
        return workLoop(hasTimeRemaining, initialTime);
      } catch (error) {
        if (currentTask !== null) {
          var currentTime = exports.unstable_now(); // $FlowFixMe[incompatible-call] found when upgrading Flow

          markTaskErrored(currentTask, currentTime); // $FlowFixMe[incompatible-use] found when upgrading Flow

          currentTask.isQueued = false;
        }

        throw error;
      }
    } else {
      // No catch in prod code path.
      return workLoop(hasTimeRemaining, initialTime);
    }
  } finally {
    currentTask = null;
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;

    if (enableProfiling) {
      var _currentTime = exports.unstable_now();

      markSchedulerSuspended(_currentTime);
    }
  }
}
/**
 * 任务调度循环 通过循环调用控制所有任务的调度
 * @param {*} hasTimeRemaining 是否还有剩余时间
 * @param {*} initialTime 初始化的时间
 * @return {boolean} 是否还有任务没有执行完
 */

function workLoop(hasTimeRemaining, initialTime) {
  var currentTime = initialTime; // 将到期的任务转移进入调度队列中

  advanceTimers(currentTime); // 检视堆顶任务，获取优先级最高的任务

  currentTask = peek(taskQueue); // 调度循环

  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    // 1. 存在需要执行的任务 2. 当前调度未暂停
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 1. 任务还未到执行时间 2. 没有剩余时间 或 需要让出控制权
      // 跳出循环，让出控制权
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    } // $FlowFixMe[incompatible-use] found when upgrading Flow

    var callback = currentTask.callback;

    if (typeof callback === "function") {
      // $FlowFixMe[incompatible-use] found when upgrading Flow
      currentTask.callback = null; // $FlowFixMe[incompatible-use] found when upgrading Flow
      // 设置执行任务的优先级

      currentPriorityLevel = currentTask.priorityLevel; // $FlowFixMe[incompatible-use] found when upgrading Flow
      // 任务是否已到期

      var didUserCallbackTimeout = currentTask.expirationTime <= currentTime;

      if (enableProfiling) {
        // $FlowFixMe[incompatible-call] found when upgrading Flow
        markTaskRun(currentTask, currentTime);
      }

      var continuationCallback = callback(didUserCallbackTimeout);
      currentTime = exports.unstable_now();

      if (typeof continuationCallback === "function") {
        // 如果返回了一个函数，无论当前时间切片还剩余多少时间，都立即跳出调度循环让出主线程
        // 可能在执行的过程中会被中断, 中断的任务会返回一个函数，方便下一次继续执行
        // If a continuation is returned, immediately yield to the main thread
        // regardless of how much time is left in the current time slice.
        // $FlowFixMe[incompatible-use] found when upgrading Flow
        currentTask.callback = continuationCallback;

        if (enableProfiling) {
          // $FlowFixMe[incompatible-call] found when upgrading Flow
          markTaskYield(currentTask, currentTime);
        } // 更新调度队列

        advanceTimers(currentTime);
        return true;
      } else {
        if (enableProfiling) {
          // $FlowFixMe[incompatible-call] found when upgrading Flow
          markTaskCompleted(currentTask, currentTime); // $FlowFixMe[incompatible-use] found when upgrading Flow

          currentTask.isQueued = false;
        } // 堆对于删除指定元素的复杂度偏高(不是O(1))，通过判断堆顶是否为当前元素来删除执行过后任务
        // 如果指定任务过程中新增了调度任务，因为task.callback为null的原因，后续也会被删除

        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        } // 更新调度队列

        advanceTimers(currentTime);
      }
    } else {
      // 当前任务不是有效任务，直接弹出
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
  } // Return whether there's additional work

  if (currentTask !== null) {
    return true;
  } else {
    var firstTimer = peek(timerQueue);

    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }

    return false;
  }
}
/**
 * 执行任务，最低优先级为Normal
 * @param {*} priorityLevel
 * @param {*} eventHandler
 * @returns
 */

function unstable_runWithPriority(priorityLevel, eventHandler) {
  // 确保优先级有效
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;

    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}
/**
 * 执行任务，最高优先级为Normal
 * @param {*} eventHandler
 * @returns
 */

function unstable_next(eventHandler) {
  var priorityLevel;

  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      // Shift down to normal priority
      priorityLevel = NormalPriority;
      break;

    default:
      // Anything lower than normal priority should remain at the current level.
      priorityLevel = currentPriorityLevel;
      break;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

function unstable_wrapCallback(callback) {
  var parentPriorityLevel = currentPriorityLevel; // $FlowFixMe[incompatible-return]

  return function() {
    // This is a fork of runWithPriority, inlined for performance.
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}
/**
 * 创建调度任务
 * @param {*} priorityLevel 任务优先级
 * @param {*} callback 任务回调
 * @param {*} options 配置参数
 * @returns
 */

function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now(); // 获取任务开始时间 可以在配置参数中传入一个延迟时间

  var startTime;

  if (typeof options === "object" && options !== null) {
    var delay = options.delay;

    if (typeof delay === "number" && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  } // 设置超时时间, 根据优先级不同设置不同的默认时长

  var timeout;

  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;

    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;

    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;

    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;

    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  } // 任务到期时间 = 开始时间 + 超时时间

  var expirationTime = startTime + timeout; // 创建任务

  var newTask = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    sortIndex: -1
  };

  if (enableProfiling) {
    newTask.isQueued = false;
  }

  if (startTime > currentTime) {
    // This is a delayed task.
    // 任务开始时间大于当前时间，需要添加到延迟队列中
    newTask.sortIndex = startTime; // 添加到延时队列

    push(timerQueue, newTask);

    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // All tasks are delayed, and this is the task with the earliest delay.
      // 当前调度队列为空，且当前任务是延迟队列中最先执行的任务
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        // 取消延迟定时器的执行
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      } // Schedule a timeout.
      // 执行延迟调度任务

      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // 任务开始时间比当前时间小，放入当前调度队列TaskQueue中
    // TaskQueue按expirationTime进行排序
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);

    if (enableProfiling) {
      markTaskStart(newTask, currentTime);
      newTask.isQueued = true;
    } // Schedule a host callback, if needed. If we're already performing work,
    // wait until the next time we yield.
    // 如果当前没有正在执行的调度任务, 立即执行任务

    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true; // 执行任务，将flushWork当参数传入

      requestHostCallback(flushWork);
    }
  }

  return newTask;
}
/**
 * 暂停执行调度循环
 * workLoop时会检查isSchedulerPaused字段，如果暂停不会继续执行
 */

function unstable_pauseExecution() {
  isSchedulerPaused = true;
}
/**
 * 继续执行调度循环
 * 可能当前调度循环让出主线程后，但是队列并没有清空，
 * 此时后续主线程有空闲后需要执行该方法继续进行调度循环
 */

function unstable_continueExecution() {
  isSchedulerPaused = false;

  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
}
/**
 * 获取调度队列第一个任务
 * @returns
 */

function unstable_getFirstCallbackNode() {
  return peek(taskQueue);
}
/**
 * 取消任务执行
 * 通过isQueued字段来判断任务是否在执行
 * @param {*} task
 */

function unstable_cancelCallback(task) {
  if (enableProfiling) {
    if (task.isQueued) {
      var currentTime = exports.unstable_now();
      markTaskCanceled(task, currentTime);
      task.isQueued = false;
    }
  } // Null out the callback to indicate the task has been canceled. (Can't
  // remove from the queue because you can't remove arbitrary nodes from an
  // array based heap, only the first one.)

  task.callback = null;
}

function unstable_getCurrentPriorityLevel() {
  return currentPriorityLevel;
}

var isMessageLoopRunning = false;
var scheduledHostCallback = null;
var taskTimeoutID = -1; // Scheduler periodically yields in case there is other work on the main
// thread, like user events. By default, it yields multiple times per frame.
// It does not attempt to align with frame boundaries, since most tasks don't
// need to be frame aligned; for those that do, use requestAnimationFrame.
// 为防止主线程上有其他工作，调度器定期让出控制权，比如用户事件等
// 默认情况下，每一帧会让出多次。因为大多数任务并不会与帧对齐，所以不会试图和帧边界对齐，针对这些需要和帧对应的，请使用requestAnimationFrame

var frameInterval = frameYieldMs;
var continuousInputInterval = continuousYieldMs;
var maxInterval = maxYieldMs;
var startTime = -1;
var needsPaint = false;
/**
 * 判断是否要移交控制权给主线程
 * @returns
 */

function shouldYieldToHost() {
  var timeElapsed = exports.unstable_now() - startTime;

  if (timeElapsed < frameInterval) {
    // 主线程阻塞时间小于一帧的间隔
    // The main thread has only been blocked for a really short amount of time;
    // smaller than a single frame. Don't yield yet.
    return false;
  } // The main thread has been blocked for a non-negligible amount of time. We
  // may want to yield control of the main thread, so the browser can perform
  // high priority tasks. The main ones are painting and user input. If there's
  // a pending paint or a pending input, then we should yield. But if there's
  // neither, then we can yield less often while remaining responsive. We'll
  // eventually yield regardless, since there could be a pending paint that
  // wasn't accompanied by a call to `requestPaint`, or other main thread tasks
  // like network events.

  if (enableIsInputPending) {
    // 判断主线程是否需要绘制(可通过requestPain更改值)
    if (needsPaint) {
      // There's a pending paint (signaled by `requestPaint`). Yield now.
      return true;
    }

    if (timeElapsed < continuousInputInterval) {
      // We haven't blocked the thread for that long. Only yield if there's a
      // pending discrete input (e.g. click). It's OK if there's pending
      // continuous input (e.g. mouseover).
      if (isInputPending !== null) {
        return isInputPending();
      }
    } else if (timeElapsed < maxInterval) {
      // Yield if there's either a pending discrete or continuous input.
      if (isInputPending !== null) {
        return isInputPending(continuousOptions);
      }
    } else {
      // We've blocked the thread for a long time. Even if there's no pending
      // input, there may be some other scheduled work that we don't know about,
      // like a network event. Yield now.
      return true;
    }
  } // `isInputPending` isn't available. Yield now.

  return true;
}
/**
 * 停止调度，允许浏览器进行绘制
 */

function requestPaint() {
  if (
    enableIsInputPending &&
    navigator !== undefined && // $FlowFixMe[prop-missing]
    navigator.scheduling !== undefined && // $FlowFixMe[incompatible-type]
    navigator.scheduling.isInputPending !== undefined
  ) {
    needsPaint = true;
  } // Since we yield every frame regardless, `requestPaint` has no effect.
}
/**
 * 动态更新一帧的保留时长，配置调度任务的执行周期
 * @param {*} fps
 * @returns
 */

function forceFrameRate(fps) {
  if (fps < 0 || fps > 125) {
    // Using console['error'] to evade Babel and ESLint
    console["error"](
      "forceFrameRate takes a positive int between 0 and 125, " +
        "forcing frame rates higher than 125 fps is not supported"
    );
    return;
  }

  if (fps > 0) {
    frameInterval = Math.floor(1000 / fps);
  } else {
    // reset the framerate
    frameInterval = frameYieldMs;
  }
}
/**
 * 执行任务直到任务死亡线
 */

var performWorkUntilDeadline = function() {
  if (scheduledHostCallback !== null) {
    var currentTime = exports.unstable_now(); // Keep track of the start time so we can measure how long the main thread
    // has been blocked.
    // 持续定位开始时间，这样我们可以明确主线程被阻塞了多久

    startTime = currentTime;
    var _hasTimeRemaining = true; // If a scheduler task throws, exit the current browser task so the
    // error can be observed.
    // 如果一个调度任务抛出，退出当前浏览器任务这样错误可以被监听到
    //
    // Intentionally not using a try-catch, since that makes some debugging
    // techniques harder. Instead, if `scheduledHostCallback` errors, then
    // `hasMoreWork` will remain true, and we'll continue the work loop.

    var hasMoreWork = true;

    try {
      // $FlowFixMe[not-a-function] found when upgrading Flow
      // 执行回调并返回是否还有剩余任务
      hasMoreWork = scheduledHostCallback(_hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        // 执行回调后还有剩余任务，继续执行函数
        // If there's more work, schedule the next message event at the end
        // of the preceding one.
        schedulePerformWorkUntilDeadline();
      } else {
        // 当前任务已执行完，消息循环停止，将当前调度callback清空
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  } // Yielding to the browser will give it a chance to paint, so we can
  // reset this.

  needsPaint = false;
}; // 调度performWorkUntilDeadline的异步方法
// 根据环境的不同，依次使用setImmediate, MessageChannel, setTimeout来异步调度任务执行

var schedulePerformWorkUntilDeadline;

if (typeof localSetImmediate === "function") {
  // Node.js and old IE.
  // There's a few reasons for why we prefer setImmediate.
  //
  // Unlike MessageChannel, it doesn't prevent a Node.js process from exiting.
  // (Even though this is a DOM fork of the Scheduler, you could get here
  // with a mix of Node.js 15+, which has a MessageChannel, and jsdom.)
  // https://github.com/facebook/react/issues/20756
  //
  // But also, it runs earlier which is the semantic we want.
  // If other browsers ever implement it, it's better to use it.
  // Although both of these would be inferior to native scheduling.
  schedulePerformWorkUntilDeadline = function() {
    localSetImmediate(performWorkUntilDeadline);
  };
} else if (typeof MessageChannel !== "undefined") {
  // DOM and Worker environments.
  // We prefer MessageChannel because of the 4ms setTimeout clamping.
  // DOM环境和Worker环境
  // 使用MessageChannel的原因是setTimeout有一个最低4ms的时间限制
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;

  schedulePerformWorkUntilDeadline = function() {
    port.postMessage(null);
  };
} else {
  // We should only fallback here in non-browser environments.
  schedulePerformWorkUntilDeadline = function() {
    // $FlowFixMe[not-a-function] nullable value
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}
/**
 * 立即执行调度任务 flushWork
 * @param {*} callback
 */

function requestHostCallback(callback) {
  scheduledHostCallback = callback; // 判断上一次消息循环是否在执行

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true; // 通过MessageChannel执行performWorkUntilDeadline函数

    schedulePerformWorkUntilDeadline();
  }
}
/**
 * 执行延迟任务
 * @param {*} callback
 * @param {*} ms
 */

function requestHostTimeout(callback, ms) {
  // $FlowFixMe[not-a-function] nullable value
  taskTimeoutID = localSetTimeout(function() {
    callback(exports.unstable_now());
  }, ms);
} // 取消延迟任务的执行

function cancelHostTimeout() {
  // $FlowFixMe[not-a-function] nullable value
  localClearTimeout(taskTimeoutID);
  taskTimeoutID = -1;
}
var unstable_Profiling = enableProfiling
  ? {
      startLoggingProfilingEvents: startLoggingProfilingEvents,
      stopLoggingProfilingEvents: stopLoggingProfilingEvents
    }
  : null;

exports.unstable_IdlePriority = IdlePriority;
exports.unstable_ImmediatePriority = ImmediatePriority;
exports.unstable_LowPriority = LowPriority;
exports.unstable_NormalPriority = NormalPriority;
exports.unstable_Profiling = unstable_Profiling;
exports.unstable_UserBlockingPriority = UserBlockingPriority;
exports.unstable_cancelCallback = unstable_cancelCallback;
exports.unstable_continueExecution = unstable_continueExecution;
exports.unstable_forceFrameRate = forceFrameRate;
exports.unstable_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel;
exports.unstable_getFirstCallbackNode = unstable_getFirstCallbackNode;
exports.unstable_next = unstable_next;
exports.unstable_pauseExecution = unstable_pauseExecution;
exports.unstable_requestPaint = requestPaint;
exports.unstable_runWithPriority = unstable_runWithPriority;
exports.unstable_scheduleCallback = unstable_scheduleCallback;
exports.unstable_shouldYield = shouldYieldToHost;
exports.unstable_wrapCallback = unstable_wrapCallback;

          'use strict';

/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
}
        
  })();
}
