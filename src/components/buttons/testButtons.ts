import { ButtonStyles, type MessageComponent } from "oceanic.js";

export function testButtons(userId: string): MessageComponent {
    return {
        type: 1,    // ACTION_ROW
        components: [
            {
                type: 2,    // BUTTON
                customID: `test:seen:${userId}`,
                label: "Seen",
                style: ButtonStyles.PRIMARY,
            },
            {
                type: 2,    // BUTTON
                customID: `test:new:${userId}`,
                label: "New",
                style: ButtonStyles.SUCCESS,
            },
        ],
    };
}
