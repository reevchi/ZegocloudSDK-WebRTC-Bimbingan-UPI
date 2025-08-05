import React, { useCallback, useEffect, useState } from "react";
import { MeetingType } from "../../utils/Types";
import { meetingsRef } from "../../utils/FirebaseConfig";
import { getDocs, query, where } from "firebase/firestore"
import { useAppSelector } from "../hooks";
import useAuth from "../../hooks/useAuth";
import Header from "../../components/Header";
import { EuiBasicTable, EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiCopy, EuiBadge } from "@elastic/eui";
import { Link } from "react-router-dom";
import moment from "moment";
import EditFlyout from "../../components/EditFlyout";


export default function MyMeetings() {
    useAuth();
    const [ meetings, setMeetings ] = useState<Array<MeetingType>>([])
    const userInfo = useAppSelector((zoom) => zoom.auth.userInfo);
    const getMyMeetings = useCallback( async () => {
        const firestoreQuery = query(meetingsRef,where("createdBy","==", userInfo?.uid));
          
        const fetchedMeeting = await getDocs (firestoreQuery);
        if (fetchedMeeting.docs.length) {
            const myMeetings:Array<MeetingType> = []
            fetchedMeeting.forEach((meeting)=> {
                myMeetings.push({
                    docId: meeting.id,
                    ...(meeting.data() as MeetingType),
            });
            });
            setMeetings(myMeetings)
            }
        }, [userInfo?.uid]);
    useEffect(() => {
        getMyMeetings();
        
    },[userInfo, getMyMeetings]);

    const [ showEditFlyout, setShowEditFlyout ] = useState(false)
    const [ editMeeting, setEditMeeting ] = useState<MeetingType>()

    const openEditFlyout = (meeting:MeetingType) => {
        setShowEditFlyout(true);
        setEditMeeting(meeting);
    };

    const closeEditFlyout = (dataChanged = false) => {
        setShowEditFlyout(false);
        setEditMeeting(undefined);
        if (dataChanged) getMyMeetings();
    };

    const column=[{
        field:"meetingName",
        name:"Meeting Name",
    },
    {
        field:"meetingType",
        name:"Meeting Type",
    },
    {
        field:"meetingDate",
        name:"Meeting Date",
    },
    {
        field:"",
        name:"Status",
        render:(meeting:MeetingType) => {
            if(meeting.status) {
                if(meeting.meetingDate === moment().format("L")) {
                    return <EuiBadge color="success" >
                        <Link style={{color:"black"}} to={`/Join/${meeting.meetingId}`}>Join Now</Link>
                        </EuiBadge>
                } else if (moment(meeting.meetingDate).isBefore(moment().format("L"))){
                    return <EuiBadge color="default">Ended</EuiBadge>
                } else {
                    return <EuiBadge color="primary">Upcoming</EuiBadge>
                }
            } else return <EuiBadge color="danger">Meeting Canceled</EuiBadge>
        }
    },
    {
        field:"",
        name:"Edit",
        render:(meeting:MeetingType) => {
            return <EuiButtonIcon aria-label="meeting-edit" iconType="indexEdit" color="danger" display="base" isDisabled={
                !meeting.status|| (moment(meeting.meetingDate).isBefore(moment().format("L")))
            }
            onClick={()=> openEditFlyout(meeting)}
            />
        }
    },
    {
        field:"meetingId",
        name:"Copy Link",
        render:(meetingId:string) => {
            return (
            <EuiCopy textToCopy={`${process.env.REACT_APP_HOST}/join/${meetingId}`}>
                {(copy:any)=> (
                    <EuiButtonIcon iconType="copy" onClick={copy} display="base" aria-label="Meeting-Copy"/>
                )}
            </EuiCopy>
            );
        }
    }
];

    return (
    <div style={{
        display:"flex",
        height:"100vh",
        flexDirection:"column",
    }}>
        <Header/>
        <EuiFlexGroup justifyContent="center" style={{margin:"1rem"}}>
            <EuiFlexItem>
                <EuiPanel>
                    <EuiBasicTable 
                    items={meetings}
                    columns={column}
                    
                    />
                </EuiPanel>
            </EuiFlexItem>
        </EuiFlexGroup>
        {
            showEditFlyout && (
            <EditFlyout closeFlyout={closeEditFlyout} meetings={editMeeting!}/>

            )
        }
    </div>
    )
}

export {};