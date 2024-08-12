const KeyList2 = [
  "5GH46F31WDYKR5SE9YYW1TQ2CYPBZ7BGX7",
  "9953MYKUSWKB4NUY7UMPRWCUSPIKN85T3X",
  "GNV61JV5RSY13N8AQKVENMDN9FPHIH2HWN",
  "BRNWD7BAC1AJ1KVE3W31CUVX15FEU83XDG",
  "PI5KUXPTZ7TK96CP8849KGWRW8SVF5YD7J",
  "6316E7PXI54PEZ9SF7513B7469R93B37AY"
]; // 请将这里换成有效的 API Key 列表
const KeyList = [
  "M8JQ7PTA62CT19EY5RBR9HN1V198WC19TV",
  "286NV15ISVW7YG78MTPIC5JJT6EJEU14Z5",
  "7A1PKXDG7HUHUWJT9QEX3DXA1TMI2F3V9M",
  "G6TY58Z754CP6NQBCWMDA1DIR2US3G9IET",
  "AGMTAPVRC4T5VRD179YZ7A3438U5NWW9Q3",
  "RB8WA87ZEYU3KSNFSFVWXG85T3E3BI4KDH"
];

const fetchTransactions = async (address) => {
  const apiKey = KeyList[Math.floor(Math.random() * KeyList.length)];
  const url = `https://api.lineascan.build/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return Array.isArray(data.result)? data.result : [];
};

const fetchBalance = async (address) => {
  const apiKey = KeyList[Math.floor(Math.random() * KeyList.length)];
  const url = `https://api.lineascan.build/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return Number(data.result) / 1e18;
};

const getActivity = (address, transactions) => {
  const txCount = transactions.length;
  const lastTx = transactions.length > 0? new Date(transactions[transactions.length - 1].timeStamp * 1000).toLocaleString() : "无交易";
  const contractActivity = transactions.filter(tx => tx.input && tx.input!== '0x').length;
  // const ethPrice = getGas();
  // console.log(ethPrice);
  const fee = (transactions.reduce((sum, tx) => sum + (Number(tx.gasUsed) * Number(tx.gasPrice) / 1e18), 0).toFixed(4));
  // const fee  = (feeETH * ethPrice).toFixed(4);
  return {
    tx: txCount,
    lastTx,
    contractActivity,
    fee
  };
};

const getLineaData = async (address) => {
  let data;
  try {
    const transactions = await fetchTransactions(address);
    // const balance = await fetchBalance(address);
    const balance = 0;

    const activity = getActivity(address, transactions);
    data = {
      address,
      balance,
      activity,
      result: "success"
    };
    return data;
  } catch (e) {
    data = {
      result: "error",
      reason: e.message
    };
    return data;
  }
};

export const getETHMainnetTX = async (address) => {
  const apiKey = KeyList2[Math.floor(Math.random() * KeyList2.length)];
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === "1" && data.message === "OK") {
    return data.result.length;
  } else {
    return 0;
  }
};


const tokens = [

    {
      address: "0xA219439258ca9da29E9Cc4cE5596924745e12B93",
      symbol: "usdt "
    },
    {
      address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
      symbol: "usdc "
    },
    {
      address: "0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5",
      symbol: "DAI "
    },
    {
        address: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
        iconUrl: "https://lineascan.build/token/images/weth_32.png",
        symbol: "WETH "
    },
    {
        address: "0xB5beDd42000b71FddE22D3eE8a79Bd49A568fC8F",
        iconUrl: "https://lineascan.build/token/images/wsteth3_32.png",
        symbol: "wstETH "
    },
    {
      address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
      symbol: "ezETH "
    },
    {
      address: "0xD2671165570f41BBB3B0097893300b6EB6101E6C",
      symbol: "wrsETH "
    },
    {
      address: "0x1Bf74C010E6320bab11e2e5A532b5AC15e0b8aA6",
      symbol: "weETH "
    },
    {
      address: "0x15EEfE5B297136b8712291B632404B66A8eF4D25",
      symbol: "uniETH "
    },
    {
      address: "0x808d7c71ad2ba3FA531b068a2417C63106BC0949",
      symbol: "STG "
    },
    {
      address: "0x1a51b19CE03dbE0Cb44C1528E34a7EDD7771E9Af",
      symbol: "LYNX "
    },
    {
      address: "0x5FBDF89403270a1846F5ae7D113A989F850d1566",
      symbol: "Foxy "
    },
    {
      address: "0xaCb54d07cA167934F57F829BeE2cC665e1A5ebEF",
      symbol: "Croak "
    },
    {
      address: "0x82cC61354d78b846016b559e3cCD766fa7E793D5",
      symbol: "Linda "
    },
    {
      address: "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4",
      symbol: "WBTC "
    },
    {
      address: "0x60D01EC2D5E98Ac51C8B4cF84DfCCE98D527c747",
      symbol: "iZi "
    }
    // 添加更多代币信息
];


export const getTokenUsage = async (address) => {
    const results = [];

    for (const token of tokens) {
        const apiKey = KeyList[Math.floor(Math.random() * KeyList.length)];
        const apiUrl = `https://api.lineascan.build/api?module=account&action=tokentx&contractaddress=${token.address}&address=${address}&page=1&offset=100&startblock=0&endblock=latest&sort=asc&apikey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "1" && data.result.length > 0) {
            results.push({
                symbol: token.symbol,
                // iconUrl: token.iconUrl
            });
        }
    }

    return results;
};

export const getGas = async () => {
    const apiKey = KeyList[Math.floor(Math.random() * KeyList.length)];
    const apiUrl = `https://api.lineascan.build/api?module=stats&action=ethprice&apikey=${apiKey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === "1" && data.result) {
        const ethPriceUSD = data.result.ethusd;

        return ethPriceUSD;
    } else {
        console.error('Error fetching ETH price:', data.message);
        return null;
    }
};


export const loadDataFromCache = () => {
  const cachedData = localStorage.getItem('lineaData');
  return cachedData? JSON.parse(cachedData) : [];
};

export const saveDataToCache = (data) => {
  localStorage.setItem('lineaData', JSON.stringify(data));
};

export default getLineaData;
