import * as Koa from 'koa';
import * as Router from 'koa-router';

import client from '../client';
import { IRecordsResult } from '../../../app/core/interfaces/issue-credential.interface';

const ctrl = client;

const routerOpts: Router.IRouterOptions = {
  prefix: '/issues'
};

const router = new Router(routerOpts);

const mapIssue = (itm: IRecordsResult) => {
  return {
    _id: itm.credential_exchange_id,
    connectionId: itm.connection_id,
    proposal: itm.credential_proposal_dict,
    created: itm.created_at,
    updated: itm.updated_at,
    state: itm.state
  };
};

router.get('/', async (ctx: Koa.Context) => {
  try {
    let res = await ctrl.issue.records();
    return (ctx.body = res.map(itm => mapIssue(itm)));
  } catch (err) {
    ctx.throw(500, err.message);
  }
});

router.post('/', async (ctx: Koa.Context) => {
  let params = ['connectionId', 'credDefId', 'comment', 'attrs'];

  let issue = ctx.request.body;

  for (let key in issue) {
    if (!params.some(param => param === key)) {
      return ctx.throw(400, `missing ${key} field`);
    }
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

router.get('/:id', async (ctx: Koa.Context) => {
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
router.post('/:id', async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  // const state = ctx.params.state;
  const issues = await ctrl.issue.records();
  const issue = issues.filter(itm => itm.credential_exchange_id === id)[0];
  console.log('the issue', issue);
  if (!issue) return ctx.throw(404);
  try {
    if (issue.state === 'offer_received') {
      console.log('offer received');
      let res = await ctrl.issue.sendRequestById(id);
      return (ctx.body = res);
    }
    if (issue.state === 'request_received') {
      console.log('attributes', issue.credential_proposal_dict);
      let res = await ctrl.issue.sendIssueById(
        id,
        issue.credential_proposal_dict.credential_proposal.attributes,
        issue.credential_proposal_dict.credential_proposal.comment
      );
      return (ctx.body = res);
    }
    if (issue.state === 'credential_received') {
      let res = await ctrl.issue.sendStoreById(id);
      return (ctx.body = res);
    }
    // return ctx.throw(400);
  } catch (err) {
    return ctx.throw(500, err.message);
  }
});

export default router;
