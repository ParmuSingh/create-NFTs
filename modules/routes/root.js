module.exports = function(app){

  web3handler = global.web3Handler

  app.get('/', async function(req, res){

    var fromWallet = web3handler.createAccount()
    var toWallet = web3Handler.createAccount()

    var fromAirdropSignature = await web3Handler.requestAirdrop(fromWallet)

    await web3Handler.confirmTransaction(fromAirdropSignature)

    var mint = await web3Handler.createMint(fromWallet, fromWallet, null, 9)
    console.log("created NFT:")
    console.log(mint)

    let fromTokenAccount = await web3Handler.createTokenAccount(mint, fromWallet)
    let toTokenAccount = await web3Handler.createTokenAccount(mint, toWallet)

    let result = await web3Handler.mintNFT(mint, fromWallet)

    console.log("minted NFT:")
    console.log(result)

    let signature = await web3Handler.sendNFT(fromTokenAccount, toTokenAccount, fromWallet)
    console.log("NFT transferred from " + fromTokenAccount + " to " + toTokenAccount + " | txsig = " + signature)

    res.send(signature)

  }); // app.get('/')
}
