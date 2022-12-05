import React, { ChangeEvent, KeyboardEvent, memo, ReactElement, useState } from 'react';

import { IconButton, TextField } from '@material-ui/core';
import { AddBox } from '@material-ui/icons';

export type AddItemFormSubmitHelperType = {
  setError: (error: string) => void;
  setTitle: (title: string) => void;
};
type AddItemFormPropsType = {
  addItem: (title: string, helper: AddItemFormSubmitHelperType) => void;
  disabled?: boolean;
};

export const AddItemForm = memo(
  ({ addItem, disabled = false }: AddItemFormPropsType): ReactElement => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);

    const onAddItemClick = async (): Promise<void> => {
      if (title.trim() !== '') {
        addItem(title, { setError, setTitle });
      } else {
        setError('Title is required');
      }
    };

    const onTextFieldChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setTitle(e.currentTarget.value);
    };

    const onKeyPressHandle = (e: KeyboardEvent<HTMLInputElement>): void => {
      if (error !== null) {
        setError(null);
      }
      // eslint-disable-next-line no-magic-numbers
      if (e.charCode === 13) {
        onAddItemClick();
      }
    };

    return (
      <div>
        <TextField
          variant="outlined"
          disabled={disabled}
          error={!!error}
          value={title}
          onChange={onTextFieldChange}
          onKeyPress={onKeyPressHandle}
          label="Title"
          helperText={error}
        />
        <IconButton
          color="primary"
          onClick={onAddItemClick}
          disabled={disabled}
          style={{ marginLeft: '5px' }}
        >
          <AddBox />
        </IconButton>
      </div>
    );
  },
);
