export const WEB3_STATUS = {
    Loading: 'loading',
    NoWeb3: 'noweb3',
    Error: 'error',
    Locked: 'locked',
    ChangeAccount: 'changeaccount',
    Ready: 'ready'
  }
  let newStatus;
  function onEnableWallet() {
      console.log('onEnableWallet');
    return new Promise((resolve, reject) => {
      tomoWeb3.currentProvider && tomoWeb3.currentProvider.enable().then(function (accounts) {
        newStatus.status = WEB3_STATUS.Ready
        newStatus.network = 88
        newStatus.account = accounts[0].toLowerCase()
        resolve(newStatus)
      }).catch(() => {
        newStatus.status = WEB3_STATUS.Error
        newStatus.network = 88
        resolve(newStatus)
      })
    })
  }
  export function onConnectWallet(currentWallet) {
    return new Promise(async (resolve, reject) => {
    newStatus = Object.assign({}, currentWallet)
      try {
        // Check current status of window.tomoWeb3
        if (typeof window.tomoWeb3 === 'undefined') {
            console.log('window.tomoWeb3 undefined');
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
            console.log('window.tomoWeb3 is not undefined');  
          onEnableWallet()
        //   const tomoWeb3 = window.tomoWeb3

        }
      } catch (e) {
        newStatus.status = WEB3_STATUS.Error
        newStatus.network = 0
        resolve(newStatus)
      }
    })
  }
//   export const tomoWeb3 = window.tomoWeb3;