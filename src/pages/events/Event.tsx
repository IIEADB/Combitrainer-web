import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchEvent, fetchInvitations } from "../../api/api";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Overview } from "./Overview";
import { Teams } from "./Teams";
import { Participants } from "./Participants";

export const Event = () => {
    const [event, setEvent] = useState(useLocation().state?.event);
    const [leaderboard, setLeaderboard] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [participationList, setParticipationList] = useState([]);
    const [selectedTab, setSelectedTab] = useState("0");
    const navigate = useNavigate();

    const getEventData = async () => {
        try {
            const response: any = await fetchEvent(event.id);
            setEvent(response.data.event);
            setLeaderboard(response.data.leaderboard);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchInvites = async () => {
        try {
            setIsLoading(true);
            const response = await fetchInvitations(event.id);
            setParticipationList(
                response.data.sent_requests.accepted
                    .concat(response.data.received_requests.accepted)
                    .concat(response.data.sent_requests.pending.concat(response.data.received_requests.pending))
                    .concat(response.data.sent_requests.rejected.concat(response.data.received_requests.rejected))
            );
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
        }
    };
    useEffect(() => {
        getEventData();
        fetchInvites();
    }, [refresh]);

    const handleTabChange = (newValue: any) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <TabContext value={selectedTab}>
                <TabList onChange={handleTabChange}>
                    <Tab label="Overview" value={"0"} />
                    <Tab label="Participants" value={"1"} />
                    <Tab label="Teams" value={"2"} disabled={!event.team_event}></Tab>
                </TabList>
                <TabPanel value="0">
                    {!isLoading && (
                        <Overview
                            event={event}
                            leaderboard={leaderboard}
                            navigate={navigate}
                            onSubmit={() => setRefresh(!refresh)}
                        />
                    )}
                </TabPanel>
                <TabPanel value="1">
                    <Participants
                        participationList={participationList}
                        navigate={navigate}
                        isLoading={isLoading}
                        eventId={event.id}
                        onSubmit={() => setRefresh(!refresh)}
                    />
                </TabPanel>
                <TabPanel value="2">
                    <Teams event={event} navigate={navigate} />
                </TabPanel>
            </TabContext>
        </Box>
    );
};
