import { dapp3_backend } from 'declarations/dapp3_backend'; // Import the canister

interface LotteryPublicInfo {
  commit_phase: boolean;
  purpose: 'Custom' | 'Fundraiser' | 'Entertainment' | 'DAOTreasury';
}

interface Lottery {
  id: string;
  info: LotteryPublicInfo;
}

const fetchLotteryData = async (): Promise<Lottery[]> => {
  try {
    const data: Array<{ text: string; LotteryPublicInfo: LotteryPublicInfo }> = await dapp3_backend.get_all_lotteries();
    // Map the data to a readable format
    const formattedData = data.map((lottery) => ({
      id: lottery.text,
      info: lottery.LotteryPublicInfo,
    }));
    return formattedData;  // Exporting the formatted lottery data
  } catch (error) {
    console.error('Error fetching lottery data:', error);
    throw new Error('Failed to fetch lottery data');
  }
};

// Export the function to fetch lottery data
export default fetchLotteryData;
