import { WalletService } from './wallet.service';

const main = async () => {
  const walletSvc = new WalletService();
  const wallet = await walletSvc.getDids();
  // console.log('wallet response', wallet);
  const create = await walletSvc.createDid();
  // console.log('created', create);

  const publicWallet = await walletSvc.getPublicDid();
  // console.log('public wallet', publicWallet);

  const makePublic = await walletSvc.assignPublicWalletDid(create.result.did);

  // console.log('made public wallet', makePublic);
};

main();
