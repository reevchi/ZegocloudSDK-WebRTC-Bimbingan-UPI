import React from "react";
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiImage, EuiPanel, EuiProvider, EuiTextColor } from "@elastic/eui";
import animation from "../assets/animation.gif"
import logo from "../assets/Logo UPI.png"
import { EuiText, EuiSpacer } from "@elastic/eui";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../../utils/FirebaseConfig";
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { firebaseDB, usersRef} from "../../utils/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { setUser } from "../slices/AuthSlice";

function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch() 

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if(currentUser) navigate("/")    
        })

    const login = async () => {
        const provider = new GoogleAuthProvider();
        const {
            user: { displayName, email, uid }} = await signInWithPopup(firebaseAuth, provider);
            if (email) {
                const firestoreQuery = query(usersRef, where("uid", "==", uid));
                const fetchedUsers = await getDocs(firestoreQuery);
                if (fetchedUsers.docs.length === 0) {
                    await addDoc(usersRef, {
                        uid,
                        name: displayName,
                        email,
                    })
                }
            }
            dispatch(setUser({ uid, name: displayName, email }));
            navigate("/");
    };

    return <div>
    <EuiProvider colorMode="dark">
        <EuiFlexGroup alignItems="center" justifyContent="center" style={{ width:"100vw", height:"100vh"}}>
            <EuiFlexItem grow={false}>
                <EuiPanel paddingSize="xl">
                    <EuiFlexGroup justifyContent="center" alignItems="center">
                        <EuiFlexItem>
                            <EuiImage src={animation} alt="logo" />
                            </EuiFlexItem>

                            <EuiFlexItem>
                            <EuiImage src={logo} alt="logo" size="230px"/> 
                                <EuiSpacer size="xs" />
                                <EuiText textAlign="center" grow={false}>
                                    <h3>
                                        <EuiTextColor>WEBRTC UPI</EuiTextColor>
                                    </h3>
                                </EuiText>
                                <EuiSpacer size="l" />
                                <EuiButton fill onClick={login} >
                                    Login dengan Google
                                </EuiButton>
                            </EuiFlexItem>

                    </EuiFlexGroup>
                </EuiPanel>
            </EuiFlexItem>
        </EuiFlexGroup>
    </EuiProvider>
    </div>;

}

export default Login;
export const userRef = collection(firebaseDB, "users");

export {};