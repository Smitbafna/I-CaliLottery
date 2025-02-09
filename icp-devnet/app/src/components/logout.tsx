import {
  clearAppEndpoint,
  clearJWT,
  getAccessToken,
  getAppEndpointKey,
  getRefreshToken,
  NodeEvent,
  ResponseData,
  SubscriptionsClient,
} from "@calimero-is-near/calimero-p2p-sdk";
import { getContextId, getStorageApplicationId } from '../utils/node';
import {
  clearApplicationId,
  getJWTObject,
  getStorageExecutorPublicKey,
} from '../utils/storage';
import { useNavigate } from 'react-router-dom';
export default function LogoutButton() {
  const navigate = useNavigate();
  const url = getAppEndpointKey();
  const applicationId = getStorageApplicationId();
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
   const logout = () => {
      clearAppEndpoint();
      clearJWT();
      clearApplicationId();
      navigate('/auth');
    };
    return (
      <button 
        className="px-5 py-2 text-[1rem] rounded-full bg-red-500 text-white font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-red-600 active:scale-95"
        onClick={logout}
      >
        Logout
      </button>
    );
    
    
}