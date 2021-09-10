module.exports = function(app){

  web3handler = global.web3Handler

  app.get('/', async function(req, res){

    var fromWallet = web3handler.createAccount()
    var toWallet = web3Handler.createAccount()

    var fromAirdropSignature = await web3Handler.requestAirdrop(fromWallet)

    await web3Handler.confirmTransaction(fromAirdropSignature)

    var mint = await web3Handler.createMint(fromWallet, fromWallet, null)
    console.log("created NFT:")
    console.log(mint)
    console.log("NFT publicKey: ")
    console.log(mint.publicKey.toBase58())
    console.log("NFT programId: ")
    console.log(mint.programId.toBase58())
    console.log("NFT associatedProgramId: ")
    console.log(mint.associatedProgramId.toBase58())

    let fromTokenAccount = await web3Handler.createTokenAccount(mint, fromWallet)
    let toTokenAccount = await web3Handler.createTokenAccount(mint, toWallet)

    let result = await web3Handler.mintNFT(mint, fromWallet)

    console.log("NFT minted:")
    console.log(result)

    // revoking minting privs after minting just 1 makes this token unique of its type, thus making it a NFT.
    await web3Handler.revokeMintingPrivileges(mint, fromWallet)

    let signature = await web3Handler.sendNFT(fromTokenAccount, toTokenAccount, fromWallet)
    console.log("NFT transferred from " + fromTokenAccount + " to " + toTokenAccount + " | txsig = " + signature)

    res.send(mint.publicKey.toBase58())

  }); // app.get('/')
}
