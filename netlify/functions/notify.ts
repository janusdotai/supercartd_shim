import type { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { default as fetch, Headers } from 'node-fetch';

interface Currency {  
  alphaCode: string;
  rate: number;  
  inverseRate: number;
}

interface CurrencyData {
  [key: string]: Currency;
}

// *********** FX HANDLER ************* //
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Log the event details
  //console.log(`${event.httpMethod} - ${event.path} - ${event.body}`);
  //Check if the HTTP method is POST
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {   

    // Specify the URL you want to fetch data from
    const apiUrl = 'https://www.floatrates.com/daily/usd.json';

    const res = await fetch(apiUrl)
    .then(x => x.json())
    .then(y =>{
      // console.log("fetched the fx...parsing")
      return y;      
    });
    
    const fx: CurrencyData = res as CurrencyData;

    const cad = fx["cad"];    
    const new_cad = { "alphaCode" : cad["alphaCode"], "inverseRate" : cad["inverseRate"] };

    const eur = fx["eur"];   
    const new_eur = { "alphaCode" : eur["alphaCode"], "inverseRate" : eur["inverseRate"] };

    const gbp = fx["gbp"];    
    const new_gbp = { "alphaCode" : gbp["alphaCode"], "inverseRate" : gbp["inverseRate"] };

    const chf = fx["chf"];    
    const new_chf = { "alphaCode" : chf["alphaCode"], "inverseRate" : chf["inverseRate"] };
    
    const fx_results = [new_cad, new_eur, new_gbp, new_chf];
    
    return{
      statusCode: 200,      
      headers: {'Cache-Control': 'public, s-maxage=600'}, //offer to cache for 10 min
      body:  JSON.stringify(fx_results)
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
