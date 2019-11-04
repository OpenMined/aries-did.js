import * as EventEmitter from 'events';

export type EventType = 'connection' | 'issue' | 'proof';

// const eventEmitter = new EventEmitter();

// eventEmitter.on('event', function(data) {
//   console.log(data); // { key: value }
//   console.log('emitter'); // true
// });

// eventEmitter.emit('event', {
//   key: 'value'
// });

export interface IConnectionHookResponse {
  connection_id: string;
  state: string;
  my_did: string;
  their_did: string;
  their_label: string;
  their_role: string;
  inbound_connection_id: string;
  initiator: string;
  invitation_key: string;
  request_id: string;
  routing_state: string;
  accept: string;
  error_msg: string;
  invitation_mode: string;
  alias: string;
}

export type ListenerType = 'connection' | 'issue' | 'proof';

export type ListenerDataType = IConnectionHookResponse;

class AgentEmitter extends EventEmitter {
  constructor(opts: { events: ListenerType[] }) {
    let { events } = opts;
    super();
  }

  attachListener(opts: { type: ListenerType; cb: () => Promise<any> }) {
    let { type, cb } = opts;
    this.addListener(type, cb);
  }
}

const events = ['connection', 'issue', 'proof'] as any[];

const agentEmitter = new AgentEmitter({
  events: ['connection', 'issue', 'proof']
});

agentEmitter.addListener('connection', (args: ListenerDataType) => {});

agentEmitter.addListener('issue', args => {});
agentEmitter.addListener('proof', args => {});

console.log('listeners', agentEmitter.eventNames());
export default agentEmitter;
