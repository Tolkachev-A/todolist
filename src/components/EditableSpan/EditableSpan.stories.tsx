import React, { ReactElement } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import { EditableSpan } from './EditableSpan';

export default {
  title: 'EditableSpan Stories',
  component: EditableSpan,
};

export const EditableSpanFormBaseExample = (): ReactElement => {
  return <EditableSpan value="StartValue" onChange={action('value changed')} />;
};
