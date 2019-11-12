import * as Koa from "koa";
import * as Router from "koa-router";
import emitter from "../agent-emitter/agent-emitter";

const routerOpts: Router.IRouterOptions = {
  prefix: "/topic/connections"
};

const router: Router = new Router(routerOpts);

router.post("/", async (ctx: Koa.Context) => {
  emitter.emit("event");

  emitter.emit("connection", ctx.request.body);
  return (ctx.body = "doing hook things");
});

export default router;
