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
  "86TGWBMRRR5Q3T2NQ8JAJXPKUQKJ4YWS7T",
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

const getL1ToL2 = async (address) => {
  const apiKey = KeyList[Math.floor(Math.random() * KeyList.length)];
  const url = `https://api.lineascan.build/api?module=account&action=tokentx&sort=asc&address=${address}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  let L1ToL2Tx = 0,
    L1ToL2Amount = 0;
  data.result.forEach((transaction) => {
    if (transaction.to!== "0x734844145b77e78dc2eaa17479c529a074a640d3") return;
    L1ToL2Tx++;
    L1ToL2Amount += Number(transaction.value) / 1e18;
  });
  return {
    L1ToL2Tx,
    L1ToL2Amount: L1ToL2Amount.toFixed(4)
  };
};


const getActivity = (address, transactions) => {
  const txCount = transactions.length;
  const lastTx = transactions.length > 0? new Date(transactions[transactions.length - 1].timeStamp * 1000).toLocaleString() : "无交易";
  const contractActivity = transactions.filter(tx => tx.input && tx.input!== '0x').length;
  const fee = transactions.reduce((sum, tx) => sum + (Number(tx.gasUsed) * Number(tx.gasPrice) / 1e18), 0).toFixed(4);
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
    const balance = await fetchBalance(address);

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

export const loadDataFromCache = () => {
  const cachedData = localStorage.getItem('lineaData');
  return cachedData? JSON.parse(cachedData) : [];
};

export const saveDataToCache = (data) => {
  localStorage.setItem('lineaData', JSON.stringify(data));
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

export default getLineaData;
