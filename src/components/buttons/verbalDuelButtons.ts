import { ButtonStyles, Constants, type MessageComponent } from "oceanic.js";

export function verbalDuelButtons(challengerId: string, opponentId: string): MessageComponent {
    const padding = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B";

    return {
        type: Constants.ComponentTypes.ACTION_ROW,
        components: [
            {
                type: Constants.ComponentTypes.BUTTON,
                customID: `verbal-duel-button:accept:${challengerId}:${opponentId}`,
                label: `${padding} Accept ${padding}`,
                style: ButtonStyles.SUCCESS,
            },
            {
                type: Constants.ComponentTypes.BUTTON,
                customID: `verbal-duel-button:decline:${challengerId}:${opponentId}`,
                label: `${padding} Decline ${padding}`,
                style: ButtonStyles.DANGER,
            },
        ],
    };
}
