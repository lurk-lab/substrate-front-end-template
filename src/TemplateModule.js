import React, { useEffect, useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  const [formValue, setFormValue] = useState(0);

  return (
    <Grid.Column width={20} style={{ textAlign: 'center' }}>
      <h1>Vector Storage</h1>
      <Form>
        <Form.Field>
          <Input
            label='Input a number'
            type='number'
            onChange={(_, { value }) => setFormValue(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Vector Push Front'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'pushFrontVector',
              inputParams: [formValue],
              paramFields: [true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function TemplateModule (props) {
  const { api } = useSubstrate();
  return api.query.templateModule && api.query.templateModule.storageVector
    ? <Main {...props} />
    : null;
}
