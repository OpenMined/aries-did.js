import * as Koa from "koa";
import * as Router from "koa-router";
import * as uuid from "uuid/v1";
import client from "../client";
import { AgentController } from "src/app/agent/agent.model";
import { IConnection } from "src/app/core/interfaces/agent.interface";
import { IConnectionsResult } from "src/app/core/interfaces/connection.interface";

// TODO: move this to core
export type ProofStateType =
  | "proposal_sent"
  | "proposal_received"
  | "request_sent"
  | "request_received"
  | "presentation_sent"
  | "presentation_received"
  | "verified";

const ctrl = client;

const routerOpts = {
  prefix: "/proofs"
};

const router = new Router(routerOpts);

router.get("/", async (ctx: Koa.Context) => {
  try {
    const connections = await ctrl.connection.getConnections({
      state: "active"
    });
    let proofs = await ctrl.proof.records();
    // console.log('connections', connections);
    if (Array.isArray(connections)) {
      let mappedProofs = connections.map(itm => {
        const proofRequests = proofs
          .filter(proof => itm.connection_id === proof.connection_id)
          .map((proof: any) => {
            let requested = [];
            for (let key in proof.presentation_request.requested_attributes) {
              requested.push(
                proof.presentation_request.requested_attributes[key]
              );
            }
            return {
              _id: proof.presentation_exchange_id,
              updated: proof.updated_at,
              created: proof.created_at,
              state: proof.state,
              connectionId: proof.connection_id,
              requested,
              ...proof
            };
          });
        let mappedProof = {
          label: itm.their_label,
          did: itm.their_did,
          connectionId: itm.connection_id,
          proofs: proofRequests,
          proofCount: proofRequests.length
        };
        return mappedProof;
      });
      return (ctx.body = mappedProofs);
    }
    return (ctx.body = []);
  } catch (err) {
    return ctx.throw(500, "internal server error");
  }
});

router.post("/", async (ctx: Koa.Context) => {
  let proof = ctx.request.body;
  try {
    const proofRequest = await ctrl.proof.buildProofRequest(
      proof.schemaDef,
      proof.connectionId,
      proof.comment,
      proof.names
    );
    const res = await ctrl.proof.sendProofRequest(proofRequest);

    ctx.status = 201;

    console.log(JSON.stringify(proofRequest, null, 2));
    return (ctx.body = { _id: res });
  } catch (err) {
    ctx.throw(500, err.message);
  }
});

router.get("/:id", async (ctx: Koa.Context) => {
  let id = ctx.params.id;
  try {
    let res = await ctrl.proof.getRecordById(id);

    // let proof = res.filter(itm => itm.presentation_exchange_id === id);
    if (!res) return ctx.throw(404);
    return (ctx.body = res);
  } catch (err) {
    ctx.throw(500, "internal server error");
  }
});

export function buildAttributes() {}

function issuerRestricts() {}

async function buildproofOpts(opts: {
  ctx: Koa.Context;
  ctrl: AgentController;
}) {
  const params = opts.ctx.params;
  console.log(params);
  // const attrs =

  const credInfo = await credDefRestricts(params.credDefId);
  console.log(credInfo);
}

async function credDefRestricts(id: string) {
  let credDef = await ctrl.credDef.getCredentialDefinition(id);
}

function buildEntity() {}

router.get("/presentation/attributes", async ctx => {
  const { credId, schemaId, relId } = ctx.request.body;

  const resMap = {
    credId: (id: string) => ctrl.credDef.getCredentialDefinition(id),
    schemaId: (id: string) => ctrl.schema.getSchemaById(id),
    relId: (id: string) => ctrl.connection.getConnections({}, id)
  };

  let cred = await ctrl.credDef.getCredentialDefinition(credId);
  let schema = await ctrl.schema.getSchemaById(schemaId);
  let connection = (await ctrl.connection.getConnections(
    {},
    relId
  )) as IConnectionsResult;

  const restricts = [
    {
      // issuer_did: connection.their_did || null,
      schema_version: schema.schema_json.ver || null,
      schema_id: schema.schema_json.id || null,
      cred_def_id: cred.credential_definition.id || null,
      schema_name: schema.schema_json.name || null
    }
  ];

  const proof_request = {
    version: "1.0",
    name: "proof req",
    nonce: "1234567890",
    requested_predicates: {},
    requested_attributes: null
  };
  let requested_attributes = Object.create(null);
  requested_attributes[uuid()] = {
    restrictions: restricts,
    non_revoked: {
      from_epoch: 1573537122,
      to_epoch: 1573537122
    },
    name: schema.schema_json.attrNames[0]
  };
  proof_request.requested_attributes = requested_attributes;

  const proofProposal = {
    comment: "blah",
    connection_id: connection.connection_id,
    proof_request
  };

  // console.log(JSON.stringify(reduced));

  return (ctx.response.body = {
    proofProposal,
    data: [cred, schema, connection]
  });
});

router.post("/:id", async (ctx: Koa.Context) => {
  let id = ctx.params.id;

  try {
    console.log("the id", id);
    let proof = await ctrl.proof.getRecordById(id);
    if (!proof) return ctx.throw(404);
    return proof;
  } catch (err) {
    return ctx.throw(err);
  }
});

router.delete("/:id", async (ctx: Koa.Context) => {
  let id = ctx.params.id;

  try {
    let res = await ctrl.proof.removeProof(id);

    return (ctx.body = res);
  } catch {
    return ctx.throw(500);
  }
});

export default router;
