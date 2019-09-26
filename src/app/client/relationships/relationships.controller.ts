import * as Koa from 'koa';
import * as Router from 'koa-router';
import { RelationshipService } from './relationships.service';

const relationship = new RelationshipService();

const routerOpts: Router.IRouterOptions = {
  prefix: '/relationships'
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  const res = await relationship.getRelationships();
  ctx.body = res;
});

router.post('/', async (ctx: Koa.Context) => {
  try {
    const invite = await relationship.createInvitation();
    console.log('invite', invite);
    ctx.body = invite;
  } catch (err) {
    ctx.status = 500;
    ctx.throw('invitation failed to create on the server');
  }
});

export default router;
