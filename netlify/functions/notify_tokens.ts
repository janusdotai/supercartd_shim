import type { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { default as fetch, Headers } from 'node-fetch';

interface Token {  
  name: string;  
  usd: string;
}

interface TokenData {
  [key: string]: Token;
}

// build a cached response for recent token prices
// *********** TOKENS HANDLER ************* //
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Log the event details
  // console.log(`${event.httpMethod} - ${event.path} - ${event.body}`);
  //Check if the HTTP method is POST
  if(event.httpMethod !== "GET"){
    return{
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try{
    
    // Specify the URL you want to fetch data from
    const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=internet-computer,ethereum,bitcoin,solana,weth,tether,dai,usd-coin,chain-key-bitcoin,chain-key-ethereum,wrapped-bitcoin,windoge98,wrapped-tao,bonk&vs_currencies=usd';

    const res = await fetch(apiUrl)
    .then(x => x.json())
    .then(y =>{
      // console.log("fetched the fx...parsing")
      return y;      
    });    
    console.log("parsed tokens success");
    
    const tokens: TokenData = res as TokenData;
    //{"bitcoin":{"usd":62044},"chain-key-bitcoin":{"usd":62805},"chain-key-ethereum":{"usd":3473.53},"dai":{"usd":0.998697},
    //"ethereum":{"usd":3423.41},"internet-computer":{"usd":13.14},"solana":{"usd":130.31},"tether":{"usd":1.001},
    //"usd-coin":{"usd":0.998591},"weth":{"usd":3412.42},"windoge98":{"usd":0.220996},"wrapped-bitcoin":{"usd":61875}}
    const bitcoin = tokens["bitcoin"];    
    const btc = { "name" : "btc", "usd" : String(bitcoin["usd"]) };

    const ckbtcA = tokens["chain-key-bitcoin"];    
    const ckBTC ={ "name" : "ckbtc", "usd" : String(ckbtcA["usd"]) };

    const ckethA = tokens["chain-key-ethereum"];    
    const ckETH ={ "name" : "cketh", "usd" : String(ckethA["usd"]) };

    const internet_computer = tokens["internet-computer"]; 
    const icp = { "name" : "icp", "usd" : String(internet_computer["usd"]) };

    const daiA = tokens["dai"];    
    const dai ={ "name" : "dai", "usd" : String(daiA["usd"]) };

    const ethereumA = tokens["ethereum"];
    const eth ={ "name" : "eth", "usd" : String(ethereumA["usd"]) };

    const solanaA = tokens["solana"];
    const sol ={ "name" : "sol", "usd" : String(solanaA["usd"]) };

    const tetherA = tokens["tether"];
    const usdt ={ "name" : "usdt", "usd" : String(tetherA["usd"]) };

    const wethA = tokens["weth"];
    const weth ={ "name" : "weth", "usd" : String(wethA["usd"]) };
    
    const usdcA = tokens["usd-coin"];
    const usdc ={ "name" : "usdc", "usd" : String(usdcA["usd"]) };
    
    const windoge98A = tokens["windoge98"];
    const exe ={ "name" : "exe", "usd" : String(windoge98A["usd"]) };
    
    const wbtcA = tokens["wrapped-bitcoin"];
    const wbtc ={ "name" : "wbtc", "usd" : String(wbtcA["usd"]) };

    const wtaoA = tokens["wrapped-tao"];
    const wtao ={ "name" : "wtao", "usd" : String(wtaoA["usd"]) };
    
    const things = [btc, icp, ckBTC, ckETH, dai, eth, weth, sol, usdt, usdc, exe, wbtc, wtao ];    

    return{
      statusCode: 200,
      headers: {'Cache-Control': 'public, s-maxage=600'}, //10 min cache
      body:  JSON.stringify(things)
    };

  }catch(error){
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };    
  };
  
};

export { handler };
