import UserContext from '../components/UserContext';
import { useContext } from 'react';

const useUser = () => useContext(UserContext);

export default useUser;
