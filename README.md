```js
import {onConnectWallet} from 'pantograph'

async connectWallet(){
  await onConnectWallet();
  console.log('window.tomoWeb3 ', window.tomoWeb3);
  const coinbase = await window.tomoWeb3.eth.coinbase;
  console.log('coinbase address', coinbase);
}

```
