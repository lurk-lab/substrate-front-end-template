import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [text, setText] = useState();

  const showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      setText(text.toString());
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <Grid.Column width={8}>
      <h1>Theorem Prover</h1>
      <Form>
        <Form.Field>
          <Input
            label='Yatima File'
            state='newFile'
            type='file'
            onChange={(e) => showFile(e)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Upload'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'theoremProver',
              inputParams: [text],
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
  return api.query.templateModule
    ? <Main {...props} />
    : null;
}
