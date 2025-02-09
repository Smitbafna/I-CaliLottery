import { dapp3_backend } from 'declarations/dapp3_backend'; 


export const fetchModeratorId = async (lotteryId: string): Promise<string | null> => {
  try {
   
    const moderatorId = await dapp3_backend.get_lottery_moderator(lotteryId);
    
   
    return moderatorId ? moderatorId : null;
  } catch (error) {
    console.error('Error fetching moderator ID:', error);
    return null;
  }
};
