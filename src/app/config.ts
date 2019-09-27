import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, './config.env') });

export interface IAgentConfig {
  [key: string]: string;
}

export const AGENT_URL = process.env.AGENT_URL;
export const TEST_AGENT_URL = process.env.TEST_AGENT_URL;
export const DEBUG = process.env.DEBUG === 'true';
export const ACME_AGENT_URL = process.env.ACME_AGENT_URL;

export default class AgentConfig implements IAgentConfig {
  [key: string]: string;
  // agentUrl: any;
  // testAgentUrl: any;
  // debug: any;

  constructor(
    config: { [index: string]: any } = {
      agentUrl: AGENT_URL,
      testAgentUrl: TEST_AGENT_URL,
      acmeAgentUrl: ACME_AGENT_URL,
      debug: DEBUG
    }
  ) {
    for (let key in config) {
      this[key] = config[key];
    }
  }
}
