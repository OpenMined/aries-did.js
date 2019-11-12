import { expect } from "chai";
import "mocha";

import { Connection } from "./connection.model";

import TestAgentConfig from "../../agent-test-config";
import { IInvitation } from "../../../core/interfaces/agent.interface";
import {
  IReceiveInvitationRequestResponse,
  IAcceptApplicationRequestResponse
} from "../../../core/interfaces/invitation-request.interface";

const agentConfig = new TestAgentConfig();

const agentConnection = new Connection(agentConfig.agentUrl);
const testConnection = new Connection(agentConfig.testAgentUrl);

let invite: IInvitation;
let testAgentInvite: IInvitation;

let receive: IReceiveInvitationRequestResponse;
let accept: IAcceptApplicationRequestResponse;

const prefix = "CONNECTION: ";

describe("connection model results", async function() {
  this.timeout(5000);

  before(prefix + "create an invitation object", async () => {
    // invite = await agentConnection.createInvitation();
    testAgentInvite = await testConnection.createInvitation();
  });
  it("should create a new invitation", async function() {
    const agentInvite = await agentConnection.createInvitation();
    expect(agentInvite).to.haveOwnProperty("@type");
    expect(agentInvite).to.haveOwnProperty("@id");
    expect(agentInvite).to.haveOwnProperty("recipientKeys");
    expect(agentInvite).to.haveOwnProperty("label");
    expect(agentInvite).to.haveOwnProperty("serviceEndpoint");
  });
  it("should receive an invitation", async function() {
    receive = await agentConnection.invitationResponse(testAgentInvite);
    expect(receive).to.haveOwnProperty("connection_id");
    expect(receive).to.haveOwnProperty("created_at");
    expect(receive).to.haveOwnProperty("state");
    expect(receive.initiator).to.equal("external");
  });
  it("should accept an invitation", async function() {});

  it("CONNECTION: should respond to an invitation", async function() {});
  it("should have active connections", async function() {
    const testAgentConnections = await testConnection.getConnections();
    if (Array.isArray(testAgentConnections)) {
      await testConnection.sendTrustPing(testAgentConnections[0].connection_id);
      let agentConnections = await agentConnection.getConnections({
        state: "active"
      });
      while (Array.isArray(agentConnections) && agentConnections.length < 1) {
        agentConnections = await agentConnection.getConnections({});
      }
      if (Array.isArray(agentConnections) && agentConnections.length > 1) {
        expect(agentConnections).to.not.be.empty;
        expect(agentConnections[0].state === "active");
      }
    }
  });

  // TODO: fix this test - there's a time delay but I've set up auto accept on all the
  // actual calls so this is kind of moot at present.

  it("should get a single connection", async () => {
    const connections = await agentConnection.getConnections();
    if (Array.isArray(connections)) {
      const connToGet = connections[0];
      const connection = await agentConnection.getConnections(
        {},
        connToGet.connection_id
      );
      if (!Array.isArray(connection)) {
        expect(connection.state).to.not.be.undefined;
      }
    }
  });
  it("should make a connection active");
  // , async () => {
  //   const connections = await testConnection.getConnections({
  //     state: 'request'
  //   });
  //   expect(connections).to.not.be.empty;
  //   if (Array.isArray(connections)) {
  //     let id = connections[0].connection_id;
  //     // let accept = await testConnection.acceptInvitation(id);
  //     let response = await testConnection.requestResponse(id);
  //     let active = await agentConnection.getConnections({ state: 'active' });
  //     expect(response.connection_id).to.not.be.undefined;
  //     if (Array.isArray(active)) {
  //       expect(active[0].state).to.equal('active');
  //     }
  //   }
  // });

  it("should remove all connections", async () => {
    await testConnection.removeAllConnections();
    await agentConnection.removeAllConnections();
    // expect(res).to.be.empty;
  });
});
