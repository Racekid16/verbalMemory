import { ButtonStyles } from "oceanic.js";

export const dualButtons = {
    type: 1,    // action row
    components: [
        {
            type: 2,    // button
            customID: "duel_accept",
            label: "Accept",
            style: ButtonStyles.SUCCESS,
        },
        {
            type: 2,    // button
            customID: "duel_decline",
            label: "Decline",
            style: ButtonStyles.DANGER,
        },
    ],
};
