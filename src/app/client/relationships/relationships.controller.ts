import * as Koa from "koa";
import * as Router from "koa-router";
import client from "../client";

import { IConnectionsResult } from "../../core/interfaces/connection.interface";

const ctrl = client;

const routerOpts: Router.IRouterOptions = {
  prefix: "/relationships"
};

const router: Router = new Router(routerOpts);

router.get("/", async (ctx: Koa.Context) => {
  try {
    const params = ctx.query;
    if (params.id) {
      const res = await ctrl.connection.getConnections(params, params.id);
      return (ctx.body = res);
    } else {
      const res = await ctrl.connection.getConnections(params);
      if (Array.isArray(res) && res.length > 0) {
        return (ctx.body = res.map(conn => {
          return {
            _id: conn.connection_id,
            state: conn.state,
            created: conn.created_at,
            did: conn.their_did,
            initiator: conn.initiator,
            name: conn.their_label
          };
        }));
      } else return (ctx.body = []);
    }
  } catch (err) {
    ctx.throw(400, "failed to get relationships");
  }
});

// router.get("/counts/:id", async ctx => {

//   return (ctx.body = results);
// });

router.post("/", async (ctx: Koa.Context) => {
  try {
    // const invite = await relationship.createInvitation();
    // ctx.body = invite;
    ctx.body = "new relationship";
  } catch (err) {
    ctx.status = 500;
    ctx.throw("invitation failed to create on the server");
  }
});
router.get("/:id/raw", async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  const relationship = (await ctrl.connection.getConnections(
    {},
    id
  )) as IConnectionsResult;
  const issues = await ctrl.issue.records();
  const proofs = await ctrl.issue.records();
  const records = {
    proofs: proofs.filter(
      itm => itm.connection_id === relationship.connection_id
    ),
    issues: issues.filter(
      itm => itm.connection_id === relationship.connection_id
    )
  };

  return (ctx.body = { relationship, ...records });
});

router.get("/:id", async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  try {
    const relationship = await ctrl.connection.getConnections({}, id);
    if (!relationship) return ctx.throw(404, "not found");
    if (!Array.isArray(relationship)) {
      return (ctx.body = {
        _id: relationship.connection_id,
        name: relationship.their_label,
        state: relationship.state,
        did: relationship.their_did,
        created: relationship.created_at,
        updated: relationship.updated_at,
        initiator: relationship.initiator
      });
    } else {
      return ctx.throw(404);
    }
  } catch (err) {
    return ctx.throw(500, err.message);
  }
});

router.post("/:id", async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  try {
    let relationship = await ctrl.connection.getConnections({}, id);
    if (!Array.isArray(relationship)) {
      const state = relationship.state;
      if (state === "response" || state === "request") {
        await ctrl.connection.sendTrustPing(id);
        relationship = await ctrl.connection.getConnections({}, id);
        return (ctx.body = relationship);
      }
      ctx.status = 201;
      return (ctx.body = relationship);
    } else {
      ctx.throw(404, "not found");
    }
  } catch (err) {
    ctx.status = 500;
    ctx.throw("invitation failed to create on the server");
  }
});

router.delete("/:id", async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  try {
    let removed = await ctrl.connection.removeConnection(id);
    return (ctx.body = removed);
  } catch (err) {
    return ctx.throw(400, err.message);
  }
});

export default router;
