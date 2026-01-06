import { ButtonStyles, type MessageComponent } from "oceanic.js";

export function duelButtons(challengerId: string, opponentId: string): MessageComponent {
    return {
        type: 1,    // ACTION_ROW
        components: [
            {
                type: 2,    // BUTTON
                customID: `duel:accept:${challengerId}:${opponentId}`,
                label: "Accept",
                style: ButtonStyles.SUCCESS,
            },
            {
                type: 2,    // BUTTON
                customID: `duel:decline:${challengerId}:${opponentId}`,
                label: "Decline",
                style: ButtonStyles.DANGER,
            },
        ],
    };
}
