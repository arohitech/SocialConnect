import React from 'react'
import { createContext , useState } from 'react'


export const UserContext = createContext();
export function UserProvider({ children }){
    const [user,setuser] = useState(null);
    return(
        <UserContext.Provider value={{user,setuser}}>
            {children}
        </UserContext.Provider>
    );
}