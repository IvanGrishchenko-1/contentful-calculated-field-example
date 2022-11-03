import React from 'react';
import {FormControl, TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import moment from "moment";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const applyDate: Date | undefined = sdk.entry.fields["applyDate"].getValue() ? moment(sdk.entry.fields["applyDate"].getValue()).toDate() : undefined;

  const parseStatus = (applyDate: Date | undefined): string => {
      let response: string;
      if (applyDate) {
          const applyDateDiff = moment().diff(applyDate, 'days');
          response = applyDateDiff >= -30 && applyDateDiff < 0 ? 'Expiring' : 'Expired';
      } else {
          response = 'New';
      }
      sdk.field.setValue(response).then(() => sdk.entry.save()).then(() => sdk.entry.publish());
      return response;
  }

  return <FormControl isRequired>
            <TextInput
                value={parseStatus(applyDate)}
                name="status"
                type="text"
                placeholder="Status"
            />
            <FormControl.HelpText>Calculated status field</FormControl.HelpText>
          </FormControl>;
};

export default Field;
