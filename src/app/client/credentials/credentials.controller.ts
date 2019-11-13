import * as Koa from "koa";
import * as Router from "koa-router";

import client from "../client";
import DB from "../db";
import { IConnectionsResult } from "../../core/interfaces/connection.interface";

const ctrl = client;
const db = DB;

const routerOpts: Router.IRouterOptions = {
  prefix: "/credentials"
};

const router = new Router(routerOpts);

router.get("/", async (ctx: Koa.Context) => {
  try {
    const creds = await client.cred.records();

    const mapped = creds.map(cred => {
      return client.schema.getSchemaById(cred.schema_id).then(schema => {
        const merged = { ...cred, ...schema };

        const {
          referent: _id,
          schema_json: { name },
          cred_def_id,
          schema_id,
          attrs
        } = merged;
        // console.log(attrs);
        const mappedAttrs = [...Object.keys(attrs)].map((key, i) => {
          return {
            label: key,
            val: attrs[key]
          };
        });

        // value: attrs[i][key]
        // console.log(attrs);
        return { _id, name, cred_def_id, schema_id, attrs: mappedAttrs };
      });
    });

    return (ctx.body = await Promise.all(mapped));
  } catch (err) {
    ctx.throw(500, err.message);
  }
});

router.get("/:id", async (ctx: Koa.Context) => {
  const { id } = ctx.params;
  try {
    const creds = await client.cred.records({ _id: id });
    console.log(creds);
    return (ctx.body = creds);
  } catch (err) {
    return ctx.throw(err);
  }
});

export default router;
