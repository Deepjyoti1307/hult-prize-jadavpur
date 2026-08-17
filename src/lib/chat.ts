export function getConversationId(uidA: string, uidB: string): string {
    return [uidA, uidB].sort().join('_');
}

export function getChatErrorMessage(error: { code?: string; message?: string }): string {
    if (error.code === 'permission-denied') {
        return 'You do not have permission to read messages.';
    }
    if (error.code === 'failed-precondition') {
        return 'Chat indexes are still building. Wait a few minutes and refresh, or deploy Firestore indexes from the Firebase Console.';
    }
    return error.message || 'Failed to load chat.';
}
