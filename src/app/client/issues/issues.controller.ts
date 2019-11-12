import * as Koa from "koa";
import * as Router from "koa-router";

import client from "../client";
import { IRecordsResult } from "../../../app/core/interfaces/issue-credential.interface";
import dataStore from "../db";

const ctrl = client;
const db = dataStore;

const routerOpts: Router.IRouterOptions = {
  prefix: "/issues"
};

const router = new Router(routerOpts);

const mapIssue = (itm: IRecordsResult) => {
  return {
    _id: itm.credential_exchange_id,
    connectionId: itm.connection_id,
    proposal: itm.credential_proposal_dict,
    created: itm.created_at,
    updated: itm.updated_at,
    state: itm.state,
    role: itm.role,
    initiator: itm.initiator
  };
};

router.get("/", async (ctx: Koa.Context) => {
  try {
    let res = await ctrl.issue.records();
    const credDefs = (await db.getRecords({ prefix: "cdef" })) as any[];
    return (ctx.body = await Promise.all(
      Array.from(new Set(res.map(issue => issue.connection_id))).map(id => {
        return ctrl.connection.getConnections({}, id).then(conn => {
          if (!Array.isArray(conn)) {
            let [...issues] = res
              .filter(issue => issue.connection_id === id)
              .map(itm => {
                let obj = {
                  ...itm,
                  role: itm.role,
                  _id: itm.credential_exchange_id,
                  created: itm.created_at,
                  name: credDefs.filter(
                    def => def._id === "cdef_" + itm.credential_definition_id
                  )[0].schema_name
                };
                return obj;
              });

            return {
              connectionId: id,
              name: conn.their_label,
              count: issues.length,
              did: conn.their_did,
              records: issues
            };
          }
        });
      })
    ));
  } catch (err) {
    ctx.throw(500, err.message);
  }
});
// TODO: I know this is an idiot schema
router.get("/flat", async (ctx: Koa.Context) => {
  try {
    return (ctx.body = await ctrl.issue.records());
  } catch (err) {
    return ctx.throw(err.message);
  }
});

router.post("/", async (ctx: Koa.Context) => {
  let params = ["connectionId", "credDefId", "comment", "attrs"];

  let issue = ctx.request.body;

  for (let key in issue) {
    if (!params.some(param => param === key)) {
      return ctx.throw(400, `missing ${key} field`);
    }
  }

  const credDef = await ctrl.credDef._credentialSvc.getCredentialDefinition(
    issue.credDefId.slice(issue.credDefId.indexOf("_") + 1)
  );

  console.log(credDef);

  // console.log(issue.credDefId.slice(issue.credDefId.indexOf('_') + 1));
  try {
    const newIssue = await client.issue.issueOfferSend(
      issue.connectionId,
      issue.comment,
      issue.attrs,
      issue.credDefId.slice(issue.credDefId.indexOf("_") + 1)
    );
    return (ctx.body = { _id: newIssue.credential_exchange_id });
  } catch (err) {
    return ctx.throw(500, err.message);
  }
});

router.get("/:id", async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  try {
    let res = await ctrl.issue.records();
    let record = res
      .filter(issue => issue.credential_exchange_id === id)
      .map(itm => mapIssue(itm))[0];
    return record ? (ctx.body = record) : ctx.throw(404);
  } catch (err) {}
});

/*
  post by id.
  looks up record to ensure it exists.
*/
router.post("/:id", async (ctx: Koa.Context) => {
  console.log(ctx.params.id);
  const id = ctx.params.id;
  // const state = ctx.params.state;
  const issues = await ctrl.issue.records();
  const issue = issues.filter(itm => itm.credential_exchange_id === id)[0];
  if (!issue) return ctx.throw(404);
  try {
    if (issue.state === "offer_received") {
      let res = await ctrl.issue.sendRequestById(id);
      return (ctx.body = res);
    }
    if (issue.state === "request_received") {
      let res = await ctrl.issue.sendIssueById(
        id,
        issue.credential_proposal_dict.credential_proposal.attributes,
        issue.credential_proposal_dict.credential_proposal.comment
      );
      return (ctx.body = res);
    }
    if (issue.state === "credential_received") {
      let res = await ctrl.issue.sendStoreById(id);
      return (ctx.body = res);
    }
    // return ctx.throw(400);
  } catch (err) {
    return ctx.throw(500, err.message);
  }
});

router.delete("/:id", async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  try {
    const res = await ctrl.issue.removeById(id);
    return (ctx.body = res);
  } catch (err) {
    throw new Error(err);
  }
});

export default router;
