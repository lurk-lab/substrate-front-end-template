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
  const [cid, setCid] = useState(0);
  const [data, setData] = useState(0);

  const [currentValue, setCurrentValue] = useState('');
  const [formValue, setFormValue] = useState('');

  useEffect(() => {
    let unsubscribe;
      api.query.templateModule.cid(newValue => {
      // The storage value is an Option
      // So we have to check whether it is None first
      // There is also unwrapOr
          if (newValue.isNone) {
              setCurrentValue('<None>');
          } else {
              setCurrentValue(newValue.unwrap().toString());
              let newVal = newValue.unwrap();
              setCid(newVal[0].toString());
              setData(newVal[1].toNumber());
          }
      }).then(unsub => {
          unsubscribe = unsub;
    })
          .catch(console.error);

      return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column width={20} style={{ textAlign: 'center' }}>
      <h1>IPLD Storage</h1>
        <Statistic
          label='Currently Stored Data'
          value={data}
          size='mini'
        />
        <Statistic
          label='Currently Stored CID'
          value={cid}
          size='mini'
        />
      <Form>
        <Form.Field>
          <Input
            label='IPLD Input'
            type='string'
            onChange={(_, { value }) => setFormValue(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Store IPLD data'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'storeIpld',
              inputParams: [formValue],
              paramFields: [true]
            }}
          />
          <TxButton
            accountPair={accountPair}
            label='Get IPLD data'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'retrieveIpld',
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
  return api.query.templateModule && api.query.templateModule.cid
    ? <Main {...props} />
    : null;
}
