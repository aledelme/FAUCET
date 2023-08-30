const { Web3 } = require("web3")
const fs = require("fs")
const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)

app.listen(3000, () => {
    console.log("Escuchando en puerto 3000")
})

const getBalance = async (req, res) => {
    const { address } = req.query
    try {
        const saldo = await web3.eth.getBalance(web3.utils.toHex(address))

        res.send(web3.utils.fromWei(saldo, "ether"))
    } catch (error) {
        res.send(error.message)
    }
}

const transfer = async (req, res) => {
    const { address } = req.params
    try {
        const json = JSON.parse(fs.readFileSync("C:/Users/aleja/Documents/Cursos/CodeCrypto/Modulos/PROJECTS WEB2.5/FAUCET/nodo/data/keystore/UTC--2023-08-22T19-52-23.716114444Z--7f57482c556d86dc5806921f5bec01e8e5774b1d"))
        const account = await web3.eth.accounts.decrypt(json, "1234")
        const tx = {
            chainId: 8888,
            to: address,
            from: account.address,
            gas: 30000,
            gasPrice: await web3.eth.getGasPrice(),
            value: web3.utils.toWei("10", "ether")
        }
        const txSigned = await account.signTransaction(tx)
        const respuesta = await web3.eth.sendSignedTransaction(txSigned.rawTransaction)
        res.send(`Transacción realizada: ${respuesta.transactionHash}`)
    } catch (error) {
        res.status(500).send(error.message)   
    }
} 

app.get("/balance", getBalance)

app.post("/faucet/:address", transfer)