use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::env::ext::{AccountId, ProposalId};
use calimero_sdk::serde::{Deserialize, Serialize};
use calimero_sdk::types::Error;
use calimero_sdk::{app, env};
use calimero_storage::collections::{UnorderedMap, Vector};
use std::collections::HashMap;

#[app::state(emits = Event)]
#[derive(Debug, PartialEq, BorshSerialize, BorshDeserialize)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct AppState {
    messages: UnorderedMap<ProposalId, Vector<Message>>,
    participants: Vec<(String, Vec<(String, u64)>)>,
    commitment_phase:HashMap<String, bool>,
    commitments:HashMap<String, String>,
    lotteries:HashMap<String, Lottery>,
    publiclotteries: Vec<(String, LotteryPublicInfo)>,
    participantlotteries: Vec<(String, u64)>,
    moderators:HashMap<String, Option<String>>,
}


#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Message {
    id: String,
    proposal_id: String,
    author: String,
    text: String,
    created_at: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "calimero_sdk::serde")]
pub struct CreateProposalRequest {
    pub action_type: String,
    pub params: serde_json::Value,
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "calimero_sdk::serde")]
pub struct PurchaseTicketRequest {
    pub lottery_id: String,
    pub num_tickets: u64,
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "calimero_sdk::serde")]
pub struct TransferPrizeRequest {
    pub lottery_id: String,
    pub winner_id: String,
    pub prize_pool: u128,
}

#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct LotteryPublicInfo {
    pub commit_phase: bool,
    pub purpose: LotteryPurpose, 
}

#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub enum LotteryPurpose {
    Entertainment,
    Fundraiser,
    DAOTreasury,
    Custom(String), 
}

#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Commit {
    pub commitment: String,
    pub revealed: bool,
    pub number: Option<u128>,
}


#[derive(
    Clone, Debug, PartialEq, PartialOrd, BorshSerialize, BorshDeserialize, Serialize, Deserialize,
)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct Lottery {
    pub lottery_id:String,
    pub commit_phase: bool,
    pub winning_number: Option<u32>,
    pub rng_seed: u64,
    pub generated_numbers: Vec<u32>,
    pub purpose: LotteryPurpose, 
    pub ticket_price: u64,
    pub prize_pool:u64,
}



#[app::event]
pub enum Event {
    ProposalCreated { id: ProposalId },
    ApprovedProposal { id: ProposalId },
}


#[app::logic]
impl AppState {
    #[app::init]
    pub fn init() -> AppState {
        AppState {
            messages: UnorderedMap::new(),
            participants: Vec::new(),
            commitment_phase:HashMap::new(),
            commitments:HashMap::new(),
            lotteries:HashMap::new(),
            publiclotteries:Vec::new(),
            moderators:HashMap::new(),
            participantlotteries: Vec::new(),

        }
    }


    pub fn store_lotteries(&mut self, lotteries: Vec<(String, LotteryPublicInfo)>) -> Result<(), Error> {
        self.publiclotteries = lotteries;
        Ok(())
    }

    pub fn get_lotteries(&self) -> Vec<(String, LotteryPublicInfo)> {
        self.publiclotteries.clone()
    }

    fn store_participant_lotteries(&mut self, lotteryid_with_num_tickets: Vec<(String, u64)>) -> Result<(), Error> {
self.participantlotteries=lotteryid_with_num_tickets;
Ok(())
    }

    pub fn get_participant_lotteries(&self) -> Vec<(String, u64)> {
        self.participantlotteries.clone()
    }

      

    pub fn purchase_request(
        &mut self,
        request: PurchaseTicketRequest,
    ) -> Result<(), Error> {
        env::log("Starting purchase_request");
        env::log(&format!("Request lottery_id: {}, num_tickets: {}", request.lottery_id, request.num_tickets));
    
        let lottery = self.lotteries.get(&request.lottery_id)
            .ok_or_else(|| Error::msg("Lottery not found"))?;
        let ticket_price = lottery.ticket_price;
    
        let amount = ticket_price * request.num_tickets;
    
        let receiver_id = "be2us-64aaa-aaaaa-qaabq-cai".to_string(); // Mock external canister ID
    
        let _ = Self::external()
            .propose()
            .transfer(AccountId(receiver_id), amount as u128)
            .send();
    
        env::log(&format!(
            "Purchase for Lottery ID {} with {} tickets created successfully. Total amount: {}",
            request.lottery_id, request.num_tickets, amount
        ));
    
        Ok(())
    }
    
    
    

    pub fn distribute_prize(
        &mut self,
        request: TransferPrizeRequest,
    ) -> Result<(), Error> {
        env::log("Starting distribute_prize");
        env::log(&format!(
            "Request lottery_id: {}, winner_id: {}, prize_pool: {}",
            request.lottery_id, request.winner_id, request.prize_pool
        ));
    
        let _lottery = self.lotteries.get(&request.lottery_id)
            .ok_or_else(|| Error::msg("Lottery not found"))?;
    
        let moderator_id = self.moderators.get(&request.lottery_id)
            .ok_or_else(|| Error::msg("Moderator not found"))?
            .clone()
            .ok_or_else(|| Error::msg("Moderator is not assigned"))?;
    
        let winner_share = (request.prize_pool as f64 * 0.60) as u128;
        let moderator_share = (request.prize_pool as f64 * 0.30) as u128;
    
        let _ = Self::external()
            .propose()
            .transfer(AccountId(request.winner_id.clone()), winner_share) // clone here
            .send();
    
        let _ = Self::external()
            .propose()
            .transfer(AccountId(moderator_id.clone()), moderator_share) // clone here
            .send();
    
        env::log(&format!(
            "Prize pool of {} distributed. Winner: {} ({}), Moderator: {} ({}).",
            request.prize_pool, request.winner_id.clone(), winner_share, moderator_id.clone(), moderator_share // clone here
        ));
    
        Ok(())
    }
    



    pub fn create_new_proposal(
        &mut self,
        request: CreateProposalRequest,
    ) -> Result<ProposalId, Error> {
        env::log("Starting create_new_proposal");
        env::log(&format!("Request type: {}", request.action_type));

        let proposal_id = match request.action_type.as_str() {
            "ExternalFunctionCall" => {
                env::log("Processing ExternalFunctionCall");
                let receiver_id = request.params["receiver_id"]
                    .as_str()
                    .ok_or_else(|| Error::msg("receiver_id is required"))?;
                let method_name = request.params["method_name"]
                    .as_str()
                    .ok_or_else(|| Error::msg("method_name is required"))?;
                let args = request.params["args"]
                    .as_str()
                    .ok_or_else(|| Error::msg("args is required"))?;
                let deposit = request.params["deposit"]
                    .as_str()
                    .ok_or_else(|| Error::msg("deposit is required"))?
                    .parse::<u128>()?;

                env::log(&format!(
                    "Parsed values: receiver_id={}, method_name={}, args={}, deposit={}",
                    receiver_id, method_name, args, deposit
                ));

                Self::external()
                    .propose()
                    .external_function_call(
                        receiver_id.to_string(),
                        method_name.to_string(),
                        args.to_string(),
                        deposit,
                    )
                    .send()
            }
            "Transfer" => {
                env::log("Processing Transfer");
                let receiver_id = request.params["receiver_id"]
                    .as_str()
                    .ok_or_else(|| Error::msg("receiver_id is required"))?;
                let amount = request.params["amount"]
                    .as_str()
                    .ok_or_else(|| Error::msg("amount is required"))?
                    .parse::<u128>()?;

                Self::external()
                    .propose()
                    .transfer(AccountId(receiver_id.to_string()), amount)
                    .send()
            }
            "SetContextValue" => {
                env::log("Processing SetContextValue");
                let key = request.params["key"]
                    .as_str()
                    .ok_or_else(|| Error::msg("key is required"))?
                    .as_bytes()
                    .to_vec()
                    .into_boxed_slice();
                let value = request.params["value"]
                    .as_str()
                    .ok_or_else(|| Error::msg("value is required"))?
                    .as_bytes()
                    .to_vec()
                    .into_boxed_slice();

                Self::external()
                    .propose()
                    .set_context_value(key, value)
                    .send()
            }
            "SetNumApprovals" => Self::external()
                .propose()
                .set_num_approvals(
                    request.params["num_approvals"]
                        .as_u64()
                        .ok_or(Error::msg("num_approvals is required"))? as u32,
                )
                .send(),
            "SetActiveProposalsLimit" => Self::external()
                .propose()
                .set_active_proposals_limit(
                    request.params["active_proposals_limit"]
                        .as_u64()
                        .ok_or(Error::msg("active_proposals_limit is required"))?
                        as u32,
                )
                .send(),
            "DeleteProposal" => Self::external()
                .propose()
                .delete(ProposalId(
                    hex::decode(
                        request.params["proposal_id"]
                            .as_str()
                            .ok_or_else(|| Error::msg("proposal_id is required"))?,
                    )?
                    .try_into()
                    .map_err(|_| Error::msg("Invalid proposal ID length"))?,
                ))
                .send(),
            _ => return Err(Error::msg("Invalid action type")),
        };

        env::emit(&Event::ProposalCreated { id: proposal_id });

        let old = self.messages.insert(proposal_id, Vector::new())?;
        if old.is_some() {
            return Err(Error::msg("proposal already exists"));
        }

        Ok(proposal_id)
    }

    pub fn approve_proposal(&self, proposal_id: ProposalId) -> Result<(), Error> {
        // fixme: should we need to check this?
        // self.messages
        //     .get(&proposal_id)?
        //     .ok_or(Error::msg("proposal not found"))?;

        Self::external().approve(proposal_id);

        env::emit(&Event::ApprovedProposal { id: proposal_id });

        Ok(())
    }

    pub fn get_proposal_messages(&self, proposal_id: ProposalId) -> Result<Vec<Message>, Error> {
        let Some(msgs) = self.messages.get(&proposal_id)? else {
            return Ok(vec![]);
        };

        let entries = msgs.entries()?;

        Ok(entries.collect())
    }

    pub fn send_proposal_messages(
        &mut self,
        proposal_id: ProposalId,
        message: Message,
    ) -> Result<(), Error> {
        let mut messages = self.messages.get(&proposal_id)?.unwrap_or_default();

        messages.push(message)?;

        self.messages.insert(proposal_id, messages)?;

        Ok(())
    }
}
