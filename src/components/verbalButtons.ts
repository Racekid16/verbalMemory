import { ButtonStyles } from "oceanic.js";

export const verbalButtons = {
    type: 1,    // action row
    components: [
        {
            type: 2,    // button
            customID: "verbal_seen",
            label: "Seen",
            style: ButtonStyles.PRIMARY,
        },
        {
            type: 2,    // button
            customID: "verbal_new",
            label: "New",
            style: ButtonStyles.SUCCESS,
        },
    ],
};
