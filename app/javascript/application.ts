import { WebsocketProvider } from '@y-rb/actioncable'
import { createConsumer } from '@rails/actioncable'
import * as Y from 'yjs'

const document = new Y.Doc();
const consumer = createConsumer();

const provider = new WebsocketProvider(document, consumer, 'FormChannel', { id: 'mmmeee' });

window.y = { doc: document, provider, Y };
