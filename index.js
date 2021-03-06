const WEB3_STATUS = {
  Loading: 'loading',
  NoWeb3: 'noweb3',
  Error: 'error',
  Locked: 'locked',
  ChangeAccount: 'changeaccount',
  Ready: 'ready'
}

const NETWORK_TOMO = [
  { key: 88, type: 'Mainnet' },
  { key: 89, type: 'Testnet' },
  { key: 5777, type: 'Private' }
]


function onEnableWallet() {
  return new Promise((resolve, reject) => {
    tomoWeb3.currentProvider && tomoWeb3.currentProvider.enable().then(function (accounts) {
      newStatus.status = WEB3_STATUS.Ready
      newStatus.network = network
      newStatus.account = accounts[0].toLowerCase()
      resolve(newStatus)
    }).catch(() => {
      newStatus.status = WEB3_STATUS.Error
      newStatus.network = network
      resolve(newStatus)
    })
  })
}

/*
----- Connect to active Wallet -----
----- Status return as object like -----
  {
    status: WEB3_STATUS constant,
    network: NETWORK_TOMO constant,
    address: Address of connected account
  }
------------------------------------------
*/
onConnectWallet = (currentWallet) => {
  return new Promise(async (resolve, reject) => {
    let newStatus = Object.assign({}, currentWallet)
    try {
      // Check current status of window.web3
      if (typeof window.tomoWeb3 === 'undefined') {
        if (currentWallet.status === WEB3_STATUS.Loading) {
          newStatus.status = WEB3_STATUS.NoWeb3
          newStatus.network = 0
          resolve(newStatus)
        } else if (newStatus.status !== WEB3_STATUS.NoWeb3) {
          newStatus.status = WEB3_STATUS.Error
          newStatus.network = 0
          resolve(newStatus)
        }
      } else {
        const tomoWeb3 = window.tomoWeb3

        // Check current network ether
        let p1 = new Promise((resolve, reject) => {
          try {
            tomoWeb3.version.getNetwork((err, network) => {
              if (err) return reject(err)
              return resolve(network)
            })
          } catch (e) {
            return reject(e)
          }
        })
        // Close p1 promise if over time
        let p2 = new Promise(function (resolve, reject) {
          setTimeout(() => {
            return reject(new Error('request timeout'))
          }, 10000)
        })

        Promise.race([p1, p2]).then((networkCode) => {
          const networkParse = parseInt(networkCode)
          const findNetwork = NETWORK_TOMO.find(itm => itm.key === networkParse)

          let network = findNetwork ? findNetwork.key : 'Unknown'

          // Enable open metamask when closed
          tomoWeb3.eth.getAccounts((err, accounts) => {
            if (accounts && newStatus.account && newStatus.account !== accounts[0]) {
              // Clear data and reload page when change new account in here
              newStatus.status = WEB3_STATUS.ChangeAccount
              newStatus.network = network
              window.location.reload(true)
              resolve(newStatus)
            }

            if (err) {
              newStatus.status = WEB3_STATUS.Error
              newStatus.network = network
              resolve(newStatus)
            } else {
              if (!accounts || accounts.length <= 0) {
                onEnableWallet()
                newStatus.status = WEB3_STATUS.Error
                newStatus.network = network
                resolve(newStatus)
              } else {
                newStatus.status = WEB3_STATUS.Ready
                newStatus.network = network
                newStatus.account = accounts[0].toLowerCase()
                resolve(newStatus)
              }
            }
          })
        }).catch((err) => {
          newStatus.status = WEB3_STATUS.Locked
          newStatus.network = 0
          newStatus.error = err
          resolve(newStatus)
        })
      }
    } catch (e) {
      newStatus.status = WEB3_STATUS.Error
      newStatus.network = 0
      resolve(newStatus)
    }
  })
}

module.exports = {
  WEB3_STATUS,
  onConnectWallet
}