import { ButtonStyles, type MessageComponent } from "oceanic.js";

export function verbalDuelButtons(challengerId: string, opponentId: string): MessageComponent {
    const padding = "\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B";

    return {
        type: 1,    // ACTION_ROW
        components: [
            {
                type: 2,    // BUTTON
                customID: `verbalDuel:accept:${challengerId}:${opponentId}`,
                label: `${padding} Accept ${padding}`,
                style: ButtonStyles.SUCCESS,
            },
            {
                type: 2,    // BUTTON
                customID: `verbalDuel:decline:${challengerId}:${opponentId}`,
                label: `${padding} Decline ${padding}`,
                style: ButtonStyles.DANGER,
            },
        ],
    };
}
