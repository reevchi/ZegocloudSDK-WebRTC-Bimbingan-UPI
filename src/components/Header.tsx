import React, { useEffect } from "react";
import react, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { useDispatch } from "react-redux";
import { EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiHeader, EuiText, EuiTextColor } from "@elastic/eui";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/FirebaseConfig";
import { getCreateMeetingBreadCrumbs, getMyMeetingsBreadCrumbs, getOneonOneMeetingBreadCrumbs, getVideoConferenceBreadCrumbs, getMeetingsBreadCrumbs } from "../utils/breadCrumbs";


function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const username = useAppSelector((zoom) => zoom.auth.userInfo?.name);
    const [breadCrumbs, setBreadCrumbs] = useState ([{ text: "Dashboard" }]);
    const [isResponsive, setIsResponsive] = useState(false);
    const dispatch =  useDispatch();
    const logout = () => {
        signOut(firebaseAuth);
    };
    
    useEffect(() => {
        const { pathname } = location;
        if(pathname==="/create") setBreadCrumbs(getCreateMeetingBreadCrumbs(navigate));
        else if(pathname==="/create1on1") setBreadCrumbs(getOneonOneMeetingBreadCrumbs(navigate));
            else if(pathname==="/videoconference") setBreadCrumbs(getVideoConferenceBreadCrumbs(navigate));
            else if(pathname==="/mymeetings") setBreadCrumbs(getMyMeetingsBreadCrumbs(navigate)); 
            else if(pathname==="/meetings") setBreadCrumbs(getMeetingsBreadCrumbs(navigate)); 

    }, [location,navigate]);

    const section = [
        {
        items:[
            <Link to="/">
                <EuiText>
                    <h2 style={{ padding:"0 1w" }}>
                        <EuiTextColor color="#0b5cff">UPI WebRTC</EuiTextColor>
                    </h2>
                </EuiText>
            </Link> 
            ],
        },
        {
            items:[
                <>
                { username ? (
                        <EuiText>
                            <h3>
                                <EuiTextColor color="white">Hello, </EuiTextColor>
                                <EuiTextColor color="#0b5cff">{username}</EuiTextColor>
                            </h3>
                        </EuiText>   
                    ):null
                }
                </>,
            ],
        },
        {
            items:[
                <EuiFlexGroup 
                justifyContent="center" 
                alignItems="center" 
                direction="row" 
                style={{gap: "2vw"}}>
                    <EuiFlexItem grow={false} style={{ flexBasis: "fit-content" }}>
                        <EuiButtonIcon  
                        onClick={logout} 
                        iconType="lock" 
                        display="fill" 
                        size="s" 
                        aria-label="logout-button"/>
                    </EuiFlexItem>
                </EuiFlexGroup>
            ]
        }
    ];
    const responsiveSection = [{
        items:[
            <Link to="/">
                <EuiText>
                    <h2 style={{ padding:"0 1w" }}>
                        <EuiTextColor color="#0b5cff">UPI WebRTC</EuiTextColor>
                    </h2>
                </EuiText>
            </Link> 
            ],
        },
        
    ];

    useEffect (() => {
        if (window.innerWidth < 480) setIsResponsive(true);
    }, []);

    return <>
    <EuiHeader 
    style={{ minHeight:"8vh" }} 
    theme="dark" 
    sections={ isResponsive ? responsiveSection : section }
    />

    <EuiHeader 
    style={{ minHeight: "8vh"}} 
    sections={[{ breadcrumbs:breadCrumbs }]} />
    </>;
}

export default Header;


export {};