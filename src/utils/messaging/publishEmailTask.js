'use strict';

import { publishTask, logger } from 'common-svc-lib';

const log = logger('Publish Task');

const publishEmailTask = async (payload, context) => {
  const taskId = await publishTask('EMAIL_TASKS', payload, context);
  log.info(`Task published to the queue for consumer with task id: ${taskId}`);
};

export default publishEmailTask;
