import { ButtonStyles, type MessageComponent } from "oceanic.js";

export function verbalTestButtons(userId: string): MessageComponent {
    const padding = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B";
    
    return {
        type: 1,    // ACTION_ROW
        components: [
            {
                type: 2,    // BUTTON
                customID: `verbalTest:seen:${userId}`,
                label: `${padding} Seen ${padding}`,
                style: ButtonStyles.PRIMARY,
            },
            {
                type: 2,    // BUTTON
                customID: `verbalTest:new:${userId}`,
                label: `${padding} New ${padding}`,
                style: ButtonStyles.SUCCESS,
            },
        ],
    };
}
