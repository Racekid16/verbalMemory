import { ButtonStyles } from "oceanic.js";

export const testButtons = {
    type: 1,    // ACTION_ROW
    components: [
        {
            type: 2,    // BUTTON
            customID: "test_seen",
            label: "Seen",
            style: ButtonStyles.PRIMARY,
        },
        {
            type: 2,    // BUTTON
            customID: "test_new",
            label: "New",
            style: ButtonStyles.SUCCESS,
        },
    ],
};
