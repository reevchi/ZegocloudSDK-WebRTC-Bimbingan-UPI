import { EuiFlexGroup, EuiForm, EuiFormRow, EuiSpacer, EuiSwitch } from "@elastic/eui";
import React, { useState } from "react";
import MeetingNameField from "../../components/FormComponents/MeetingNameField";
import MeetingUsersField from "../../components/FormComponents/MeetingUsersField";
import useAuth from "../../hooks/useAuth";
import useFetchUsers from "../../hooks/useFetchUsers";
import moment from "moment";
import MeetingDateField from "../../components/FormComponents/MeetingDateField";
import CreateMeetingButtons from "../../components/FormComponents/CreateMeetingButtons";
import { FieldErrorType, UserType } from "../../utils/Types";
import { addDoc } from "firebase/firestore";
import { meetingsRef } from "../../utils/FirebaseConfig";
import { generateMeetingId } from "../../utils/generateMeetingId";
import { useAppSelector } from "../hooks";
import { useNavigate } from "react-router-dom";
import  useToast  from "../../hooks/useToast";
import Header from "../../components/Header";
import MeetingMaximumUserField from "../../components/FormComponents/MeetingMaximumUserField";


function VideoConference() {

    useAuth()
    const [users] = useFetchUsers();

    const [createToast] = useToast();

    const navigate = useNavigate();

    const uid = useAppSelector((zoom) => zoom.auth.userInfo?.uid);

    const [ meetingName, setMeetingName ] = useState("");

    const [ selectedUsers, setSelectedUsers] = useState<Array<UserType>>([])

    const [ startDate, setStartDate ] = useState(moment());

    const [ size, setSize ] = useState(1);

    const [ anyoneCanJoin, setAnyoneCanJoin] = useState(false)

    const [ showErrors, setShowErrors ] = useState <{
        meetingName:FieldErrorType,
        meetingUser:FieldErrorType,
    }>({
        meetingName:{
            show:false,
            message:[],
        },
        meetingUser: {
            show:false,
            message:[],
        },
    });
    const onUserChange = (selectedOptions:any) => {
        setSelectedUsers(selectedOptions)
    };

    const validateForm = () => {
        let errors = false;
        const clonedShowErrors = {...showErrors}
        if(!meetingName.length) {
            clonedShowErrors.meetingName.show=true;
            clonedShowErrors.meetingName.message=["Please Enter Meeting Name"];
            errors = true;
        } else {
            clonedShowErrors.meetingName.show = false;
            clonedShowErrors.meetingName.message = [];
        }
        if (!selectedUsers.length) {
            clonedShowErrors.meetingUser.show=true;
            clonedShowErrors.meetingUser.message=["Please Select a User"];
        } else {
            clonedShowErrors.meetingUser.show = false;
            clonedShowErrors.meetingUser.message = [];
        }
        setShowErrors(clonedShowErrors);
        return errors;
    };


    const createMeeting = async() => {
        if(!validateForm()) {
            const meetingId = generateMeetingId();
            await addDoc(meetingsRef, {
                createdBy:uid,
                meetingId,
                meetingName,
                meetingType: anyoneCanJoin ? "anyone-can-join" : "video-cenference",
                invitedUsers: anyoneCanJoin ? [] : selectedUsers.map((user:UserType)=>user.uid),
                meetingDate: startDate.format("L",),
                maxUsers: anyoneCanJoin ? 100 : size,
                status:true,
            });
            createToast({
                title: anyoneCanJoin ? " Anyone can join meeting created successfuly. " : "Video Conference Successfuly.",
                type: "success",
            });
            navigate("/")
        }
        
    };

    return (<div
            style={{
            display: "flex",
            height: "100vh",
            flexDirection: "column",
        }}>
        <Header />
        <EuiFlexGroup justifyContent="center" alignItems="center">
            <EuiForm>
                <EuiFormRow display="columnCompressed" label="Anyone can join">
                    <EuiSwitch showLabel={false} label="Anyone can join" checked={anyoneCanJoin} onChange={(e) => setAnyoneCanJoin(e.target.checked)}/>
                </EuiFormRow>
                <MeetingNameField 
                    label="Meeting Name"
                    placeholder="Input Meeting Name"
                    value={meetingName}
                    setMeetingName={setMeetingName}
                    isInvalid={showErrors.meetingName.show}
                    error={showErrors.meetingName.message}
                />

                {
                    anyoneCanJoin ? (<MeetingMaximumUserField value={size} setValue={setSize}/> 

                
                    ) : (
                <MeetingUsersField 
                    label="Invite Users" 
                    options={users} 
                    onChange={onUserChange} 
                    selectedOptions={selectedUsers} 
                    singleSelection={{ asPlainText:false }} 
                    isClearable={false} 
                    placeholder="Select a user"
                    isInvalid={showErrors.meetingUser.show}
                    error={showErrors.meetingUser.message}
                />
                )}   
                <MeetingDateField 
                selected={startDate}
                setStartDate={setStartDate}
                />
                <EuiSpacer />
                <CreateMeetingButtons createMeeting={createMeeting} />
            </EuiForm>
        </EuiFlexGroup>
    </div>
    );
}


export default VideoConference; 
