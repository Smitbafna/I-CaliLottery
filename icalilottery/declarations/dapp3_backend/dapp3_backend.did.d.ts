import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface LotteryPublicInfo {
  'commit_phase' : boolean,
  'purpose' : LotteryPurpose,
}
export type LotteryPurpose = { 'Custom' : string } |
  { 'Fundraiser' : null } |
  { 'Entertainment' : null } |
  { 'DAOTreasury' : null };
export interface _SERVICE {
  'buy_tickets' : ActorMethod<[string, bigint], undefined>,
  'clear_state' : ActorMethod<[], undefined>,
  'create_commitment' : ActorMethod<[string, string], undefined>,
  'create_new_lottery' : ActorMethod<[string, bigint], undefined>,
  'end_commitment_phase' : ActorMethod<[string], undefined>,
  'generate_and_set_winner' : ActorMethod<[string], bigint>,
  'get_all_lotteries' : ActorMethod<[], Array<[string, LotteryPublicInfo]>>,
  'get_all_lottery_moderators' : ActorMethod<
    [],
    Array<[string, [] | [string]]>
  >,
  'get_commitment_phase' : ActorMethod<[string], boolean>,
  'get_lottery_moderator' : ActorMethod<[string], [] | [string]>,
  'get_participant_lotteries' : ActorMethod<[], Array<[string, bigint]>>,
  'participant_joins' : ActorMethod<[string], undefined>,
  'start_commitment_phase' : ActorMethod<[string], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
