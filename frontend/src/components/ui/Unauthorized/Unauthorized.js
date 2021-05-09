import React from 'react';
import { messages } from '../../../common/utils';

const Unauthorized = () => {
  return <div>{messages.t('general.unauthorized')}</div>;
};

export default Unauthorized;
