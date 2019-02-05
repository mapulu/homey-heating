import { MenuItem, Select } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import { forEach, sortBy } from "lodash";
import React from 'react';
import { RouteComponentProps } from "react-router";
import { Link, withRouter } from 'react-router-dom';
import { IHeatingPlan } from '../../app/model';
import { modeAPI, planAPI } from '../api/heating';
import { useDevices, useMode, usePlans, useZones } from '../api/hooks';
import AddFab from "../components/AddFab";
import AppHeader from "../components/AppHeader";
import InputContainer from "../components/InputContainer";
import { AppMenuButton } from '../components/Menu';
import SubHeader from '../components/SubHeader';
import translate from '../i18n/Translation';
import Page from "../layouts/Page";

const styles: StyleRulesCallback = (theme) => ({
    list: {
        marginTop: 0,
        marginBottom: theme.spacing.unit * 2,
    }
});

type Props = WithStyles<typeof styles> & RouteComponentProps;

const OverviewPage: React.StatelessComponent<Props> = (props) => {
    const { classes } = props;
    const { plans, loadPlans } = usePlans();
    const { zones } = useZones();
    const { devices } = useDevices();
    const { mode, loadMode } = useMode();

    function formatAttachments(plan: IHeatingPlan): string {
        let elements: string[] = [];

        forEach(plan.devices, d => {
            const device = devices[d];
            if (device != null) {
                elements.push(device.name);
            }
        });

        forEach(plan.zones, d => {
            const zone = zones[d];
            if (zone != null) {
                elements.push(zone.name);
            }
        });

        return sortBy(elements, e => e).join(", ");
    }

    const createNew = () => {
        props.history.push(`/plans/new`);
    }

    return (
        <Page>
            {{
                header: (<AppHeader title={translate("plans.title")} button={<AppMenuButton />} />),
                paddingTop: 50,

                body: (
                    <React.Fragment>
                        <SubHeader text={translate("plans.heatingmode.section")} />
                        <InputContainer>
                            <Select
                                fullWidth
                                onChange={async (evt) => {
                                    await modeAPI.setMode(parseInt(evt.target.value));
                                    await loadMode();
                                }}
                                value={mode}
                            >
                                <MenuItem value={0}>{translate("Modes.0")}</MenuItem>
                                <MenuItem value={1}>{translate("Modes.1")}</MenuItem>
                                <MenuItem value={2}>{translate("Modes.2")}</MenuItem>
                                <MenuItem value={3}>{translate("Modes.3")}</MenuItem>
                                <MenuItem value={4}>{translate("Modes.4")}</MenuItem>
                            </Select>
                        </InputContainer>

                        <SubHeader text={translate("plans.plans.section")} />
                        <List className={classes.list}>
                            {plans.length > 0 && <Divider />}
                            {plans.map((plan) => (
                                <React.Fragment key={plan.id}>
                                    <ListItem {...{ to: `/plans/${plan.id}` }} component={Link} button>
                                        <ListItemText primary={plan.name} secondary={formatAttachments(plan)} />

                                        <ListItemSecondaryAction>
                                            <Switch
                                                onChange={async () => { await planAPI.togglePlanState(plan); await loadPlans(); }}
                                                checked={plan.enabled} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                        <AddFab onClick={createNew} />
                    </React.Fragment>
                )
            }}
        </Page>
    );
}

export default withRouter(withStyles(styles)(OverviewPage));
