import React, { ReactElement } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

import { AddItemForm } from './AddItemForm';

export default {
  title: 'AddItemForm Stories',
  component: AddItemForm,
};

const asyncCallback = async (...params: any[]): Promise<void> => {
  action('Button inside form clicked')(...params);
};

export const AddItemFormBaseExample = (): ReactElement => {
  return <AddItemForm addItem={asyncCallback} />;
};

export const AddItemFormDisabledExample = (): ReactElement => {
  return <AddItemForm disabled addItem={asyncCallback} />;
};
