export const idlFactory = ({ IDL }) => {
  const LotteryPurpose = IDL.Variant({
    'Custom' : IDL.Text,
    'Fundraiser' : IDL.Null,
    'Entertainment' : IDL.Null,
    'DAOTreasury' : IDL.Null,
  });
  const LotteryPublicInfo = IDL.Record({
    'commit_phase' : IDL.Bool,
    'purpose' : LotteryPurpose,
  });
  return IDL.Service({
    'buy_tickets' : IDL.Func([IDL.Text, IDL.Nat64], [], []),
    'clear_state' : IDL.Func([], [], []),
    'create_commitment' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'create_new_lottery' : IDL.Func([IDL.Text, IDL.Nat64], [], []),
    'end_commitment_phase' : IDL.Func([IDL.Text], [], []),
    'generate_and_set_winner' : IDL.Func([IDL.Text], [IDL.Nat64], []),
    'get_all_lotteries' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, LotteryPublicInfo))],
        ['query'],
      ),
    'get_all_lottery_moderators' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Text)))],
        ['query'],
      ),
    'get_commitment_phase' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'get_lottery_moderator' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'get_participant_lotteries' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))],
        ['query'],
      ),
    'participant_joins' : IDL.Func([IDL.Text], [], []),
    'start_commitment_phase' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
