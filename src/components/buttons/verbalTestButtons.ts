import { ButtonStyles, type MessageComponent } from "oceanic.js";

export function verbalTestButtons(userId: string): MessageComponent {
    return {
        type: 1,    // ACTION_ROW
        components: [
            {
                type: 2,    // BUTTON
                customID: `verbalTest:seen:${userId}`,
                label: "Seen",
                style: ButtonStyles.PRIMARY,
            },
            {
                type: 2,    // BUTTON
                customID: `verbalTest:new:${userId}`,
                label: "New",
                style: ButtonStyles.SUCCESS,
            },
        ],
    };
}
