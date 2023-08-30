import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [cuenta, setCuenta] = useState(0)
  const [tx, setTx] = useState(null)
  const [saldo, setSaldo] = useState(0)

  useEffect(() => {
    window.ethereum.request({
      method: "eth_requestAccounts"
    }).then(cuentas => {
      setCuenta(cuentas[0])
      window.ethereum.on("accountsChanged", (cuentas) => {
        setCuenta(cuentas[0])
      })
    })
  })

  useEffect(() => {
    getSaldo()
    setTx(null)
  },[cuenta])


  async function invocarFaucet(){
    setTx("Procesando...")
    const url = `http://localhost:3000/faucet/${cuenta}`
    const response = await fetch(url, {method:"POST"})
    const hash = await response.text()
    setTx(hash)
    getSaldo()
  }

  async function getSaldo(){
    const url = `http://localhost:3000/balance/?address=${cuenta}`
    const response = await fetch(url)
    const saldo = await response.text()
    setSaldo(saldo)
  }
  return (
    <div>
      <h1>{cuenta}</h1>
      <h3>Saldo: {saldo}</h3>
      <button onClick={() => invocarFaucet()}>Recibir 10 eth</button>
      <div>{tx && tx}</div>
    </div>
  )
}

export default App
