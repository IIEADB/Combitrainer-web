import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchInvitations } from "../../api/api";
import { Box, Grid, Tab } from "@mui/material";
import { UserList } from "./UserList";
import { ParticipationList } from "./ParticipationList";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Overview } from "./Overview";
import { TeamList } from "./TeamList";

export const Event = () => {
    const { eventId } = useParams();
    const eventIdNumber: number | undefined = eventId ? parseInt(eventId, 10) : undefined;
    const { state } = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [participationList, setParticipationList] = useState([]);
    const [selectedTab, setSelectedTab] = useState("0");
    const navigate = useNavigate();

    const fetchInvites = async () => {
        try {
            setIsLoading(true);
            const response = await fetchInvitations(eventIdNumber);
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
        fetchInvites();
    }, [eventId]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <TabContext value={selectedTab}>
                <TabList onChange={handleTabChange}>
                    <Tab label="Overview" value={"0"} />

                    <Tab label="Participants" value={"1"} />
                    <Tab label="Teams" value={"2"}></Tab>
                </TabList>
                <TabPanel value="0">{!isLoading && <Overview event={state.event} navigate={navigate} />}</TabPanel>
                <TabPanel value="1">
                    <Grid container spacing={1} sx={{ margin: "10px" }}>
                        <ParticipationList participationList={participationList} navigate={navigate} />
                        <Grid item xs={6}>
                            {!isLoading && <UserList eventId={eventId} participationList={participationList} />}
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value="2">
                    <TeamList event={state.event} navigate={navigate} />
                </TabPanel>
            </TabContext>
        </Box>
    );
};
