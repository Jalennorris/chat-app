export function determineConversationType(participants) {
    return participants.length === 1 ? 'one' : 'group';
}

