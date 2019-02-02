import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/lightBlue';
import deepOrange from '@material-ui/core/colors/deepOrange';
import green from '@material-ui/core/colors/green';
import React from 'react';
import { WithStyles, StyleRulesCallback, withStyles, Typography } from '@material-ui/core';
const Icon = require('../../../assets/icon_black.svg');

const getColor = (temp: number) => {
    if (temp <= 16) return blue;
    if (temp <= 20) return green;
    return deepOrange;
}

const AVATAR_DIMENSION = 35;
const styles: StyleRulesCallback = (theme) => ({
    root: {
        fontSize: "1em",
        float: "left",
        textAlign: "center",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        width: AVATAR_DIMENSION + 10,
        // height: AVATAR_DIMENSION,
        // overflow: "hidden",
    },

    avatar: {
        width: AVATAR_DIMENSION,
        height: AVATAR_DIMENSION,
        lineHeight: AVATAR_DIMENSION,

        position: "relative",
        overflow: "hidden",
    },

    img: {
        width: AVATAR_DIMENSION,
        height: AVATAR_DIMENSION,

        zIndex: 2,
        position: "absolute",
        left: 0,
        bottom: 0,
    },

    fill: {
        display: "block",

        width: AVATAR_DIMENSION,
        height: AVATAR_DIMENSION-2,

        zIndex: 1,

        position: "absolute",
        left: 0,
        bottom: 1,
    }

    // root: {
    //     fontSize: "1em",

    //     width: height,
    //     height: height,
    //     lineHeight: height,

    //     zIndex: 2,

    //     float: "left",
    //     textAlign: "center",
    //     border: "1px solid",
    //     borderRadius: "100%",
    //     position: "relative",

    //     overflow: "hidden",
    // },

    // fill: {
    //     display: "block",

    //     width: height,
    //     height: height,

    //     zIndex: 1,
    //     position: "absolute",
    //     left: 0,
    //     bottom: 0,
    // }
});

type FilledProps = {
    digits?: number;
    value: number;
    fill: number;
} & WithStyles<typeof styles>;

function FixedDigits(value: number, digits: number) {
    return (Math.round(value * Math.pow(10,digits)) / Math.pow(10,digits)).toFixed(digits);
}

const BaseFilledTemperatureAvatar: React.StatelessComponent<FilledProps> = (props) => {
    const { value, classes, fill } = props;
    let { digits } = props;

    const color = getColor(value)[500];
    if (digits == null) { digits = 2; }

    return (
        <div className={classes.root}>
            <div className={classes.avatar} >
                <object className={classes.img} data={Icon} type="image/svg+xml">
                </object>
                <span style={{ height: `calc(${fill}% - 5px)`, background: color }} className={classes.fill}></span>
            </div>

            <Typography variant="body1" color="textSecondary" component="div">{FixedDigits(value, digits)}°</Typography>
        </div>

        // <div style={{ borderColor: color }} className={classes.root}>
        //     <span>{value} %</span>
        //     <span style={{height: `${value}%`, background: color }} className={classes.fill}></span>
        // </div>
    );
}

type Props = {
    value: number;
}

const BaseTemperatureAvatar: React.StatelessComponent<Props> = (props) => {
    const { value } = props;

    return (
        <Avatar style={{ padding: "25px", background: getColor(value)[500], fontSize: "1em" }}>{FixedDigits(value, 1)}°</Avatar>
    );
}

export function normalize(min: number, max: number, x: number) {
    return (x - min) / (max - min);
}

export const FilledTemperatureAvatar = withStyles(styles)(BaseFilledTemperatureAvatar);
export const TemperatureAvatar = withStyles(styles)(BaseTemperatureAvatar);

