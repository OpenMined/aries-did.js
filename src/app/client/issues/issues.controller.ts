import * as Koa from 'koa';
import * as Router from 'koa-router';

import client from '../client';
import { AgentController } from 'src/app/agent/agent.model';

const agentController = client;

const routerOpts: Router.IRouterOptions = {
  prefix: '/issues'
};

const router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  try {
    let res = await agentController.issue.records();
    return (ctx.body = res);
  } catch (err) {
    ctx.throw(500, err.message);
  }
});

router.post('/', async (ctx: Koa.Context) => {
  let params = ['connectionId', 'credDefId', 'comment', 'attrs'];

  let issue = ctx.body;

  for (let key in issue) {
    if (!params.some(param => param === key))
      return ctx.throw(400, `missing ${key} field`);
  }
  try {
    const newIssue = await client.issue.issueOfferSend(
      issue.connectionId,
      issue.comment,
      issue.attrs,
      issue.credDefId
    );
    return (ctx.body = newIssue.credential_definition_id);
  } catch (err) {
    return ctx.throw(500, err.message);
  }
});

router.post('/:id', async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  const state = ctx.params.state;

  try {
    if (state === 'request') {
      let res = await agentController.issue.sendRequestById(id);
      return (ctx.body = res);
    }
    if (state === 'issue') {
      let res = await agentController.issue.sendIssueById(
        id,
        ctx.body.attrs,
        ctx.body.comment
      );
      return (ctx.body = res);
    }
    if (state === 'store') {
      let res = await agentController.issue.sendStoreById(id);
      return (ctx.body = res);
    }
  } catch (err) {
    return ctx.throw(500, err.message);
  }
});

export default router;
