import React from 'react';
import {FormControl, TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import moment from "moment";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const createdAt: Date = moment(sdk.entry.getSys().createdAt).toDate();
  const sdkApplyDate: string | undefined = sdk.entry.fields["applyDate"]?.getValue() as string;
  const fixedSdkApplyDate: string | undefined =
      sdkApplyDate ?
          sdkApplyDate.length > 10
              ? sdkApplyDate.slice(0, sdkApplyDate.indexOf('T'))
              : sdkApplyDate
          : undefined;
  const applyDate: Date | undefined = fixedSdkApplyDate ? new Date(fixedSdkApplyDate) : undefined;

  const parseStatus = (createdAt: Date, applyDate: Date | undefined): string => {
      let response: string = 'Active';
      const newDiff = moment().diff(createdAt, 'hours');
      if (newDiff >= 0 && newDiff <= 336) {
          response = 'New';
      }
      if (applyDate) {
          const expiringDateDiff = moment(applyDate).diff(moment(), 'hours');
          const expiredDateDiff = moment().diff(applyDate, 'hours');
          if (expiringDateDiff >= 0 && expiringDateDiff <= 336) {
              response = 'Expiring';
          }
          if (expiredDateDiff > 0) {
              response = 'Expired';
          }
      }
      sdk.field.setValue(response).then(() => sdk.entry.save()).then(() => sdk.entry.publish());
      return response;
  }

  return <FormControl isRequired>
            <TextInput
                value={parseStatus(createdAt, applyDate)}
                name="status"
                type="text"
                placeholder="Status"
            />
            <FormControl.HelpText>Calculated status field</FormControl.HelpText>
          </FormControl>;
};

export default Field;
