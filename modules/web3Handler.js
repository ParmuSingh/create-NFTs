var web3 = require('@solana/web3.js');
var splToken = require('@solana/spl-token');

var Common = require('./common.js')
app_config = Common.config;


class Web3Handler {
  constructor(){
    // Solana network
    this.solanaNetwork = app_config['solana-network'];
    // initialize connection
    this.connection = new web3.Connection(
      web3.clusterApiUrl(this.solanaNetwork),
      'confirmed',
    );

    console.log("solana cluster connection established.")

  } // constructor() - end
} // Web3Connection - end

Web3Handler.prototype.createAccount = function() {
  var fromWallet = web3.Keypair.generate();

  return fromWallet
} // createAccount() - end

Web3Handler.prototype.createTokenAccount = async function(mint, wallet) {

  let tokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    wallet.publicKey,
  );

  return tokenAccount
} // createTokenAccount() - end

Web3Handler.prototype.requestAirdrop = async function(fromWallet) {

  var fromAirdropSignature = await this.connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL,
  );

  return fromAirdropSignature
} // requestAirdrop() - end

Web3Handler.prototype.confirmTransaction = async function(fromAirdropSignature) {

  return await this.connection.confirmTransaction(fromAirdropSignature);
} // confirmTransaction() - end

Web3Handler.prototype.createMint = async function(accountThatPaysFees, NFTMintingAuthority, NFTFreezingAuthority) {

  let mint = await splToken.Token.createMint(
    this.connection,
    accountThatPaysFees,
    NFTMintingAuthority.publicKey,
    NFTFreezingAuthority,
    0, // decimalPoints = 0 becuase its a NFT, and not a FT.
    splToken.TOKEN_PROGRAM_ID,
  );

  return mint

} // createMint() - end

Web3Handler.prototype.revokeMintingPrivileges = async function(token, currentAuthority) {

  await token.setAuthority(
    token.publicKey, // The account of the token
    null, // The new authority you want to set.
    "MintTokens", // The type of authority that the account currently has.
    currentAuthority.publicKey, // The public key of the current authority holder.
    [] // An array of signers. In our case, we do not have multi-sig enabled.
  )

} // revokeMintingPrivileges() - end

Web3Handler.prototype.mintNFT = async function(tokenToMint, mintTo) {
  //get the token account of the fromWallet Solana address, if it does not exist, create it
  let tokenAccount = await tokenToMint.getOrCreateAssociatedAccountInfo(
    mintTo.publicKey,
  );

  let result = await tokenToMint.mintTo(
    tokenAccount.address, //who it goes to
    mintTo.publicKey, // minting authority
    [], // multisig
    1, // mint 1 token (of smallest unit), because its one token only (assuming minting privileges are revoked) this token is unique and therefore non-fungible.
  );

  return result

} // mintNFT() - end

Web3Handler.prototype.sendNFT = async function(fromTokenAccount, toTokenAccount, mintingAuthority) {

  var transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      mintingAuthority.publicKey,
      [],
      1,
    ),
  );

  // Sign transaction, broadcast, and confirm
  var signature = await web3.sendAndConfirmTransaction(
    this.connection,
    transaction,
    [mintingAuthority],
    {commitment: 'confirmed'},
  );

  return signature
} // sendNFT() - end

global.web3Handler = new Web3Handler()
