import * as Koa from 'koa';
import * as Router from 'koa-router';
import { EventEmitter } from 'events';
const routerOpts: Router.IRouterOptions = {
  prefix: '/topic/basic-messages'
};

const router: Router = new Router(routerOpts);

router.post('/', async (ctx: Koa.Context) => {
  console.log('doing hook things', ctx.request.body);
  return (ctx.body = 'doing hook things');
});

interface IHook {
  router: Router;
}

export class BasicMessagesHook extends EventEmitter {
  router: Router;
  constructor(router: Router) {
    super();
    this.router = router;
  }
}
export default router;
