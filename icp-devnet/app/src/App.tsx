

import IndexPage from "@/pages/index";
import EnterLotteryPage from "@/pages/enter";
import CreateLotteryPage from "@/pages/createlottery";
import CommitPage from "@/pages/commit";
import DemoPage from "@/pages/demo";
import WinnerPage from "@/pages/winner";
import RevealPage from "@/pages/reveal";
import LoginPage from "@/pages/login";
import SetupPage from "@/pages/setup";
import { AccessTokenWrapper } from '@calimero-is-near/calimero-p2p-sdk';
import { Routes, Route } from 'react-router-dom';
import { getNodeUrl } from './utils/node';

function App() {
  return (
    
    <AccessTokenWrapper getNodeUrl={getNodeUrl}>
   
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/home" element={<IndexPage />} />
        <Route path="/enterlottery" element={<EnterLotteryPage />} />
        <Route path="/commit" element={<CommitPage />} />
        <Route path="/createlottery" element={<CreateLotteryPage />} />
        <Route path="/propose" element={<DemoPage />} />
        <Route path="/reveal" element={<RevealPage />} />
        <Route path="/winner" element={<WinnerPage />} />
      </Routes>
   
  </AccessTokenWrapper> 
  );
}

export default App;


