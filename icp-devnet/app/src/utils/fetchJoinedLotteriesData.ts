import { dapp3_backend } from 'declarations/dapp3_backend'; 

interface JoinedLottery {
  lotteryId: string;
  tickets: number;
}

const fetchJoinedLotteryData = async (): Promise<JoinedLottery[]> => {
  try {
   
    const data: Array<{ text: string; nat64: number }> = await dapp3_backend.get_participant_lotteries();
   
    const formattedData = data.map((lottery) => ({
      lotteryId: lottery.text,
      tickets: lottery.nat64,
    }));
    return formattedData;  
  } catch (error) {
    console.error('Error fetching joined lottery data:', error);
    throw new Error('Failed to fetch joined lottery data');
  }
};


export default fetchJoinedLotteryData;
