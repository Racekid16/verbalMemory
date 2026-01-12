import { ButtonStyles, Constants, type MessageComponent } from "oceanic.js";

export function verbalTestButtons(userId: string): MessageComponent {
    const padding = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B";
    
    return {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
            {
                type: Constants.ComponentTypes.BUTTON,
                customID: `verbal-test-button:seen:${userId}`,
                label: `${padding} Seen ${padding}`,
                style: ButtonStyles.PRIMARY,
            },
            {
                type: Constants.ComponentTypes.BUTTON,
                customID: `verbal-test-button:new:${userId}`,
                label: `${padding} New ${padding}`,
                style: ButtonStyles.SUCCESS,
            },
        ],
    };
}
