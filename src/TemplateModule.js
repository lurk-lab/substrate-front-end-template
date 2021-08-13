import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Statistic } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored values
  const [vec, setVec] = useState('');
  // const [data, setData] = useState(0);

  // const [currentValue, setCurrentValue] = useState('');
  const [formValue, setFormValue] = useState('');

  useEffect(() => {
    let unsubscribe;
    api.query.templateModule.vec(newValue => {
      // The storage value is an Option
      // So we have to check whether it is None first
      // There is also unwrapOr
      if (newValue.isNone) {
        setVec('<None>');
      } else {
        setVec(newValue.unwrap().toString());
      }
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column width={20} style={{ textAlign: 'center' }}>
      <h1>Vector Storage</h1>
        <Statistic
          label='Currently Stored Vector'
          value={vec}
          size='mini'
        />
      <Form>
        <Form.Field>
          <Input
            label='Vector Input'
            type='string'
            onChange={(_, { value }) => setFormValue(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Store Vector'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'storeVector',
              inputParams: [formValue],
              paramFields: [true]
            }}
          />
          <TxButton
            accountPair={accountPair}
            label='Get Vector'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'retrieveVector',
              inputParams: [formValue],
              paramFields: [true]
            }}
          />
          <TxButton
            accountPair={accountPair}
            label='Push front'
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
  return api.query.templateModule && api.query.templateModule.vec
    ? <Main {...props} />
    : null;
}
