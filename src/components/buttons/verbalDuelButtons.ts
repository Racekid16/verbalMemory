import { ButtonStyles, type MessageComponent } from "oceanic.js";

export function verbalDuelButtons(challengerId: string, opponentId: string): MessageComponent {
    return {
        type: 1,    // ACTION_ROW
        components: [
            {
                type: 2,    // BUTTON
                customID: `verbalDuel:accept:${challengerId}:${opponentId}`,
                label: "Accept",
                style: ButtonStyles.SUCCESS,
            },
            {
                type: 2,    // BUTTON
                customID: `verbalDuel:decline:${challengerId}:${opponentId}`,
                label: "Decline",
                style: ButtonStyles.DANGER,
            },
        ],
    };
}
