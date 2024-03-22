import { Grid } from "@mui/material";
import { UserList } from "./components/UserList";
import { ParticipationList } from "./components/ParticipationList";

export const Participants = (props: {
    participationList: never[];
    navigate: any;
    isLoading: boolean;
    eventId: string | undefined;
    onSubmit?: any;
}) => {
    return (
        <Grid container spacing={1} sx={{ margin: "10px" }}>
            <ParticipationList
                onSubmit={props.onSubmit}
                participationList={props.participationList}
                navigate={props.navigate}
            />
            <Grid item xs={6}>
                {!props.isLoading && (
                    <UserList
                        onSubmit={props.onSubmit}
                        eventId={props.eventId}
                        participationList={props.participationList}
                    />
                )}
            </Grid>
        </Grid>
    );
};
