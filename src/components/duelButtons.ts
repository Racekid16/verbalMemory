import { ButtonStyles } from "oceanic.js";

export const duelButtons = {
    type: 1,    // ACTION_ROW
    components: [
        {
            type: 2,    // BUTTON
            customID: "duel_accept",
            label: "Accept",
            style: ButtonStyles.SUCCESS,
        },
        {
            type: 2,    // BUTTON
            customID: "duel_decline",
            label: "Decline",
            style: ButtonStyles.DANGER,
        },
    ],
};
