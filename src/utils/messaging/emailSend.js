'use strict';

import publishEmailTask from './publishEmailTask.js';
import { serviceConfig } from '../../constants.js';

const requestEmailSend = (input, requestContext) => {
  const payload = {
    to: input.to,
    template: input.template,
    data: input.data,
  };

  const context = {
    userId: requestContext.userId,
    sessionId: requestContext.sessionId,
    correlationId: requestContext.correlationId,
    source: serviceConfig.serviceName,
    action: 'EMAIL',
  };

  publishEmailTask(payload, context);
};

export default requestEmailSend;
